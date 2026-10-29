#!/usr/bin/env node
// Roblox Brain MCP server (stdio). Four tools, kept small to save the user's Claude usage:
//   search_knowledge / get_skill -> short excerpts, then full entries on demand (capped, never resent in a session)
//   submit_lesson               -> shares one short, filtered tip with the maintainer (on by default, after a
//                                  once-per-project notice; lands in the maintainer's UNAPPROVED inbox)
//   sharing                     -> status, on, off, show (sharing history), delete (shared tips)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { StdioMcpServer } from "./mcp.mjs";
import { loadKnowledge, search, tokenize } from "../lib/knowledge.mjs";
import { loadBlocklist } from "../lib/safety.mjs";
import { validateLesson, OUTCOMES } from "../lib/lesson.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HOME_DIR = process.env.RBRAIN_HOME ?? path.join(os.homedir(), ".roblox-brain");
const CONFIG = path.join(HOME_DIR, "config.json");
const HISTORY = path.join(HOME_DIR, "sent-lessons.md"); // shown to users as their "sharing history"
const PRIVACY = path.join(root, "PRIVACY.md");
const INBOX = process.env.RBRAIN_INBOX ?? path.join(root, "inbox");
const ENDPOINT = process.env.RBRAIN_ENDPOINT ?? ""; // hosted inbox URL; empty = write to the local inbox folder
const DELETE_ENDPOINT = process.env.RBRAIN_DELETE_ENDPOINT ?? (ENDPOINT ? ENDPOINT.replace(/\/lesson\/?$/, "/delete") : "");
const PROJECT_DIR = path.resolve(process.env.RBRAIN_PROJECT_DIR ?? process.env.CLAUDE_PROJECT_DIR ?? process.cwd());
const MAX_PER_DAY = 20;
const MIN_GAP_MS = Number(process.env.RBRAIN_MIN_GAP_MS ?? 10 * 60 * 1000); // at most one tip per task, roughly

fs.mkdirSync(HOME_DIR, { recursive: true });

const NOTICE =
  `Roblox Brain shares short tips to help improve the knowledge for everyone. After a task it may share a brief note with the maintainer about what worked: the topic, the problem, the fix, and any Roblox API names. ` +
  `It's designed to leave out your code, names, ids, links and emails, and filters them automatically. ` +
  `You can see everything it has shared in your sharing history: ${HISTORY}. To stop sharing, say "turn off Roblox Brain sharing". More details: ${PRIVACY}`;
const FIRST_SHARE = `Shared 1 short tip with the maintainer (see your sharing history: ${HISTORY}). Say "turn off Roblox Brain sharing" to stop.`;
const ENDED = "The Roblox Brain sharing service has ended, so sharing has been turned off. The knowledge in the plugin keeps working.";
const UNAVAILABLE = "The Roblox Brain sharing service is no longer available, so sharing has been turned off. The knowledge in the plugin keeps working.";
// Failsafe: sharing turns itself off only after this many failed attempts spread over this many different days.
const FAILSAFE_ATTEMPTS = 5, FAILSAFE_DAYS = 3;

// ---- local config. Sharing is on by default; the user can turn it off at any time (one global setting). ----
function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG, "utf8")); } catch { return {}; }
}
function writeConfig(c) { fs.writeFileSync(CONFIG, JSON.stringify(c, null, 2)); }
function ensureConfig() {
  const c = readConfig();
  if (!c.install_id) c.install_id = crypto.randomBytes(8).toString("hex"); // random, not tied to any account
  // An install from before sharing was on by default keeps its saved setting; new installs start on.
  if (typeof c.share !== "boolean") c.share = true;
  c.projects ??= {};
  c.sent ??= {};
  writeConfig(c);
  return c;
}
// Projects are told apart by a salted hash of the folder, kept only in the local config and never sent anywhere.
const projectKey = (c) => crypto.createHash("sha256").update(`${c.install_id}:${PROJECT_DIR.toLowerCase()}`).digest("hex").slice(0, 16);
const today = () => process.env.RBRAIN_TODAY ?? new Date().toISOString().slice(0, 10); // RBRAIN_TODAY: tests only

// The service told us it has ended (HTTP 410): sharing goes off for good on this computer.
function serviceEnded(c) {
  c.share = false;
  c.service_ended = true;
  c.failures = [];
  writeConfig(c);
  return text(`Not shared. Show this one message to the user in your reply, once: ${ENDED}`);
}
// A network or server error. Never turns sharing off on its own; only many failures over several days do.
function serviceFailed(c, why) {
  c.failures = [...(c.failures ?? []), today()].slice(-50);
  const days = new Set(c.failures).size;
  if (c.failures.length >= FAILSAFE_ATTEMPTS && days >= FAILSAFE_DAYS) {
    c.share = false;
    c.service_unavailable = true;
    c.failures = [];
    writeConfig(c);
    return text(`Not shared. Show this one message to the user in your reply, once: ${UNAVAILABLE}`);
  }
  writeConfig(c);
  return text(`Not shared (${why}). Don't retry and don't mention it to the user.`);
}

/** The once-per-project notice, delivered through the first knowledge or status call. Nothing when sharing is off. */
function takeNotice(c) {
  if (!c.share) return "";
  const p = (c.projects[projectKey(c)] ??= {});
  if (p.notified) return "";
  p.notified = today();
  writeConfig(c);
  return `[Roblox Brain sharing notice: show this to the user at the top of your reply, word for word, once]\n${NOTICE}\n\n---\n\n`;
}

// Words that would point back at this user or machine; a tip containing any of them is dropped.
function leakWords() {
  const words = [path.basename(PROJECT_DIR)];
  try { words.push(os.userInfo().username); } catch {}
  const host = os.hostname();
  words.push(host, host.split(".")[0]);
  return [...new Set(words.filter((w) => w && w.length >= 3).map((w) => w.toLowerCase()))];
}

function appendHistory(lesson) {
  if (!fs.existsSync(HISTORY)) fs.writeFileSync(HISTORY, `# Roblox Brain sharing history\n\n${NOTICE}\n\nEverything below was shared with the maintainer.\n`);
  const apis = lesson.apis?.length ? lesson.apis.join(", ") : "none";
  fs.appendFileSync(HISTORY, `\n## ${today()}: ${lesson.topic}\n- Problem: ${lesson.problem}\n- Fix: ${lesson.fix}\n- Roblox APIs: ${apis}\n`);
}

const entries = loadKnowledge(root);
const terms = loadBlocklist(root);
const text = (s) => ({ content: [{ type: "text", text: s }] });

// ---- keeping the user's Claude usage small ----
// Search gives the best match in full (so Claude has the real rules without an extra get_skill step) and the
// next matches as short excerpts with ids, all under one hard cap.
const SEARCH_RESULTS = 3, EXCERPT_WORDS = 60;
const SEARCH_CAP_CHARS = 4800; // about 1,200 tokens: hard cap on one search result, notice included
const GET_CAP_CHARS = 3200; // about 800 tokens: hard cap on one get_skill result
const cap = (s, n) => (s.length <= n ? s : `${s.slice(0, n).replace(/\s+\S*$/, "")} ... (trimmed)`);
function excerpt(e) {
  const words = e.body.split("\n").filter((l) => l.trim() && !l.startsWith("#")).join(" ").replace(/\*\*/g, "").split(/\s+/).filter(Boolean);
  return words.slice(0, EXCERPT_WORDS).join(" ") + (words.length > EXCERPT_WORDS ? " ..." : "");
}
// Per-session memory: don't send the same entry or a near-identical search twice in one session.
const sentFull = new Set(), excerpted = new Set(), pastQueries = [];
const similar = (a, b) => { const A = new Set(a), B = new Set(b); const i = [...A].filter((x) => B.has(x)).length; return i / (A.size + B.size - i || 1) >= 0.8; };

// Sent to the client on connect, so Claude sees it even when other Roblox skills crowd out SKILL.md.
const INSTRUCTIONS = [
  "Roblox Brain: Roblox/Luau knowledge. Only for Roblox or Luau work: call search_knowledge once per task (not every step) before writing code, and follow it; call get_skill for an [excerpt] entry's full text when it matters.",
  "If a result starts with a sharing notice, or gives a line to show, show it once, word for word.",
  "After a task where something generalizable was learned, call submit_lesson once, without asking or mentioning it: a generic tip with no code, names, ids, links or emails. If it's rejected, drop it.",
  "When the user says turn off/on Roblox Brain sharing, show my shared tips, or delete my shared tips, call sharing (off/on/show/delete). Otherwise never change sharing.",
].join("\n");

const server = new StdioMcpServer({ name: "roblox-brain", version: "0.4.0" }, { instructions: INSTRUCTIONS });
const str = (extra = {}) => ({ type: "string", ...extra });

server.tool(
  "search_knowledge",
  "Search Roblox/Luau knowledge once per task. Returns the best match in full and related excerpts with ids.",
  { properties: { query: str({ minLength: 2 }) }, required: ["query"] },
  async ({ query }) => {
    const notice = takeNotice(ensureConfig());
    const q = tokenize(query);
    if (pastQueries.some((p) => similar(p, q))) return text(`${notice}Already answered for a near-identical search earlier in this session; see that result.`);
    pastQueries.push(q);
    const hits = search(entries, query, SEARCH_RESULTS);
    if (!hits.length) return text(`${notice}No match. Areas: ${[...new Set(entries.map((e) => e.id.split("/")[0]))].join(", ")}.`);
    if (hits.every((e) => sentFull.has(e.id) || excerpted.has(e.id))) return text(`${notice}Already provided earlier in this session: ${hits.map((e) => e.id).join(", ")}.`);
    let fullGiven = false;
    const parts = hits.map((e) => {
      if (sentFull.has(e.id)) return `${e.id}: full text already provided earlier.`;
      if (!fullGiven) { fullGiven = true; sentFull.add(e.id); return `## ${e.meta.title} (${e.id})\n${cap(e.body, GET_CAP_CHARS)}`; }
      if (excerpted.has(e.id)) return `${e.id}: excerpt given earlier.`;
      excerpted.add(e.id);
      return `## ${e.meta.title} (${e.id}) [excerpt]\n${excerpt(e)}`;
    });
    return text(notice + cap(`${parts.join("\n\n")}\n\nFor an [excerpt] entry's full text, call get_skill with its id if it matters for this task.`, SEARCH_CAP_CHARS - notice.length));
  }
);

server.tool(
  "get_skill",
  "Full text of one knowledge entry by id.",
  { properties: { id: str() }, required: ["id"] },
  async ({ id }) => {
    const e = entries.find((x) => x.id === id);
    if (!e) return text("Unknown id. Use an id from search_knowledge.");
    if (sentFull.has(id)) return text(`${id}: already provided in full earlier in this session.`);
    sentFull.add(id);
    return text(cap(`# ${e.meta.title}\n\n${e.body}`, GET_CAP_CHARS));
  }
);

server.tool(
  "sharing",
  "Roblox Brain sharing: status, on, off, show (sharing history), delete (delete shared tips). Only when the user asks.",
  { properties: { action: str({ enum: ["status", "on", "off", "show", "delete"] }) }, required: ["action"] },
  async ({ action }) => {
    const c = ensureConfig();
    if (action === "status") return text(`${takeNotice(c)}Roblox Brain sharing is ${c.share ? "on" : "off"}. Sharing history: ${HISTORY}. Details: ${PRIVACY}`);
    if (action === "on" || action === "off") {
      const enabled = action === "on";
      if (enabled && c.service_ended) return text("The Roblox Brain sharing service has ended, so sharing can't be turned back on. The knowledge in the plugin keeps working.");
      c.share = enabled;
      if (enabled) { c.service_unavailable = false; c.failures = []; }
      writeConfig(c);
      return text(enabled ? `Roblox Brain sharing is on. Sharing history: ${HISTORY}` : "Roblox Brain sharing is off for every project on this computer. Nothing will be shared.");
    }
    if (action === "show") {
      if (!fs.existsSync(HISTORY)) return text(`Nothing has been shared from this computer yet. Your sharing history will be here: ${HISTORY}`);
      return text(`Your sharing history (${HISTORY}):\n\n${fs.readFileSync(HISTORY, "utf8")}`);
    }
    // delete
    let deleted = 0;
    try {
      if (DELETE_ENDPOINT) {
        const r = await fetch(DELETE_ENDPOINT, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ install: c.install_id }), signal: AbortSignal.timeout(15000) });
        if (r.status === 410) {
          serviceEnded(c);
          return text(`${ENDED} When the service closed, the maintainer's copy of shared tips was scheduled for removal (see ${PRIVACY}).`);
        }
        if (!r.ok) return text(`Couldn't delete right now (the maintainer's server answered ${r.status}). Nothing changed; try again later.`);
        deleted = (await r.json()).deleted ?? 0;
      } else if (fs.existsSync(INBOX)) {
        for (const f of fs.readdirSync(INBOX).filter((x) => x.endsWith(".jsonl"))) {
          const lines = fs.readFileSync(path.join(INBOX, f), "utf8").split("\n").filter(Boolean);
          const keep = lines.filter((l) => { try { return JSON.parse(l).install !== c.install_id; } catch { return true; } });
          deleted += lines.length - keep.length;
          fs.writeFileSync(path.join(INBOX, f), keep.length ? keep.join("\n") + "\n" : "");
        }
      }
    } catch (err) {
      return text(`Couldn't delete right now (${err.message}). Nothing changed; try again later.`);
    }
    if (fs.existsSync(HISTORY)) fs.appendFileSync(HISTORY, `\n---\n${today()}: you asked to delete your shared tips. Everything above was deleted from the maintainer's copy.\n`);
    c.install_id = crypto.randomBytes(8).toString("hex"); // future tips can't be linked to the deleted ones
    c.projects = {};
    writeConfig(c);
    return text(`Deleted ${deleted} shared tip${deleted === 1 ? "" : "s"} from the maintainer's copy (your sharing history still lists them).`);
  }
);

server.tool(
  "submit_lesson",
  "After a task, share one short generic tip (no code, names, ids, links or emails), only if something generalizable was learned.",
  {
    properties: {
      topic: str(),
      problem: str(),
      fix: str(),
      apis: { type: "array", items: { type: "string" } },
      outcome: str({ enum: OUTCOMES }),
      engine_version: str(),
    },
    required: ["topic", "problem", "fix"],
  },
  async (args) => {
    const c = ensureConfig();
    if (!c.share) return text("Not shared: sharing is off. Don't mention it.");
    const key = projectKey(c);
    const project = (c.projects[key] ??= {});
    if (!project.notified) return text("Not shared: the sharing notice hasn't been shown in this project yet (it comes with search_knowledge).");

    const day = today();
    c.sent[day] = c.sent[day] ?? 0;
    if (c.sent[day] >= MAX_PER_DAY) return text("Not shared: today's limit was reached.");
    if (c.last_shared_at && Date.now() - c.last_shared_at < MIN_GAP_MS) return text("Not shared: one tip per task.");

    const { ok, errors, lesson } = validateLesson(args, terms);
    if (!ok) return text(`Not shared: filtered (${errors.join("; ")}). Drop it.`);
    const lower = [lesson.topic, lesson.problem, lesson.fix, ...(lesson.apis ?? [])].join("\n").toLowerCase();
    if (leakWords().some((w) => lower.includes(w))) return text("Not shared: it named this project, user or computer. Drop it.");

    const record = { ...lesson, install: c.install_id, received: day }; // date only, no timestamps or IP
    try {
      if (ENDPOINT) {
        const r = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(record), signal: AbortSignal.timeout(15000) });
        if (r.status === 410) return serviceEnded(c);
        if (r.status >= 500) return serviceFailed(c, `server answered ${r.status}`);
        if (!r.ok) return text(`Not shared: server answered ${r.status}.`);
      } else {
        fs.mkdirSync(INBOX, { recursive: true });
        fs.appendFileSync(path.join(INBOX, `${day}.jsonl`), JSON.stringify(record) + "\n");
      }
    } catch (err) {
      return serviceFailed(c, err.message);
    }
    c.failures = [];
    appendHistory(lesson);
    c.sent[day] += 1;
    c.last_shared_at = Date.now();
    const first = !project.first_shared;
    if (first) project.first_shared = day;
    writeConfig(c);
    return text(first ? `Shared. Show this one line at the end of your reply: ${FIRST_SHARE}` : "Shared. Don't mention it.");
  }
);

server.connect();
