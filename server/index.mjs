#!/usr/bin/env node
// Roblox Brain MCP server (stdio). Three jobs:
//   search_knowledge / get_skill  -> give the user's Claude your curated, generic Roblox knowledge
//   submit_lesson                 -> opt-in, anonymous, validated lesson feedback (lands in the UNAPPROVED inbox)
//   sharing_status / set_sharing  -> the user controls whether anything is ever sent
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadKnowledge, search } from "../lib/knowledge.mjs";
import { loadBlocklist } from "../lib/safety.mjs";
import { validateLesson, OUTCOMES } from "../lib/lesson.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HOME_DIR = process.env.RBRAIN_HOME ?? path.join(os.homedir(), ".roblox-brain");
const CONFIG = path.join(HOME_DIR, "config.json");
const INBOX = process.env.RBRAIN_INBOX ?? path.join(root, "inbox");
const ENDPOINT = process.env.RBRAIN_ENDPOINT ?? ""; // hosted inbox URL; empty = write to local inbox folder
const MAX_PER_DAY = 20;

fs.mkdirSync(HOME_DIR, { recursive: true });

// ---- local config: sharing is OFF until the user explicitly turns it on ----
function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG, "utf8")); } catch { return {}; }
}
function writeConfig(c) { fs.writeFileSync(CONFIG, JSON.stringify(c, null, 2)); }
function ensureConfig() {
  const c = readConfig();
  if (!c.install_id) c.install_id = crypto.randomBytes(8).toString("hex"); // random, not tied to any account
  if (typeof c.share !== "boolean") c.share = false;
  if (!c.sent) c.sent = {};
  writeConfig(c);
  return c;
}

const entries = loadKnowledge(root);
const terms = loadBlocklist(root);
const text = (s) => ({ content: [{ type: "text", text: s }] });

const server = new McpServer({ name: "roblox-brain", version: "0.1.0" });

server.tool(
  "search_knowledge",
  "Search curated, generic Roblox development knowledge (UI, security, DataStores, deprecated APIs, ...). Call this BEFORE writing Roblox/Luau code for a task, then follow what it returns.",
  { query: z.string().min(2).describe("What you are about to build or fix, e.g. 'responsive shop UI' or 'save player data'") },
  async ({ query }) => {
    const hits = search(entries, query);
    if (!hits.length) return text(`No entries matched "${query}". Available topics: ${entries.map((e) => e.id).join(", ")}`);
    return text(hits.map((e) => `## ${e.meta.title} (${e.id})\n${e.body}`).join("\n\n---\n\n"));
  }
);

server.tool(
  "get_skill",
  "Fetch one full knowledge entry by id (e.g. 'ui/scaling'). Use list ids from search_knowledge results.",
  { id: z.string() },
  async ({ id }) => {
    const e = entries.find((x) => x.id === id);
    return text(e ? `# ${e.meta.title}\n\n${e.body}` : `Unknown id. Available: ${entries.map((x) => x.id).join(", ")}`);
  }
);

server.tool(
  "sharing_status",
  "Report whether anonymous lesson sharing is currently on or off for this user, and what would be sent.",
  {},
  async () => {
    const c = ensureConfig();
    return text(
      `Lesson sharing is ${c.share ? "ON" : "OFF"}. ` +
        `Only short generic lessons (topic, problem, fix, API names, outcome) are ever sent: never code, game names, usernames or ids. ` +
        `Every lesson must be shown to the user and approved before submit_lesson is called.`
    );
  }
);

server.tool(
  "set_sharing",
  "Turn anonymous lesson sharing on or off. ONLY call this when the user has explicitly asked to turn sharing on or off. Never turn it on by yourself.",
  { enabled: z.boolean() },
  async ({ enabled }) => {
    const c = ensureConfig();
    c.share = enabled;
    writeConfig(c);
    return text(`Lesson sharing is now ${enabled ? "ON" : "OFF"}.`);
  }
);

server.tool(
  "submit_lesson",
  "Submit ONE short, generic lesson learned while building something in Roblox, so the shared knowledge can improve. RULES: (1) only if sharing is on (check sharing_status); (2) first show the user the exact lesson text and get a clear yes; (3) describe the general pattern only: NO code, NO game/place/user names, NO ids, NO links. If nothing generalizable happened, do not submit anything.",
  {
    topic: z.string().describe("Category path like 'ui/scaling' or 'security/remote-validation'"),
    problem: z.string().describe("What went wrong or was non-obvious, in general terms (max 300 chars)"),
    fix: z.string().describe("What worked, in general terms (max 400 chars)"),
    apis: z.array(z.string()).optional().describe("Roblox class/API names involved, e.g. ['CanvasGroup']"),
    outcome: z.enum(OUTCOMES).optional(),
    engine_version: z.string().optional(),
    user_approved: z.literal(true).describe("Must be true: the user saw this exact lesson and said yes"),
  },
  async (args) => {
    const c = ensureConfig();
    if (!c.share) return text("Not sent: lesson sharing is OFF. Ask the user if they want to turn it on (set_sharing) before submitting.");

    const day = new Date().toISOString().slice(0, 10);
    c.sent[day] = c.sent[day] ?? 0;
    if (c.sent[day] >= MAX_PER_DAY) return text("Not sent: daily lesson limit reached.");

    const { ok, errors, lesson } = validateLesson(args, terms);
    if (!ok) return text(`Not sent. Fix these and try again (keep it generic, no code/names/ids):\n- ${errors.join("\n- ")}`);

    const record = { ...lesson, install: c.install_id, received: day }; // date only, no timestamps/IP
    try {
      if (ENDPOINT) {
        const r = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(record) });
        if (!r.ok) return text(`Not sent: server responded ${r.status}.`);
      } else {
        fs.mkdirSync(INBOX, { recursive: true });
        fs.appendFileSync(path.join(INBOX, `${day}.jsonl`), JSON.stringify(record) + "\n");
      }
    } catch (err) {
      return text(`Not sent: ${err.message}`);
    }
    c.sent[day] += 1;
    writeConfig(c);
    return text("Thanks, the lesson was submitted anonymously for review.");
  }
);

await server.connect(new StdioServerTransport());
