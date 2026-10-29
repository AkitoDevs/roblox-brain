// Guardrails for the plugin's footprint in the user's Claude usage. Fails if:
//   (a) always-on overhead (server instructions + all tool definitions + SKILL.md description) passes the target,
//   (b) any search_knowledge result passes the hard cap,
//   (c) any knowledge entry passes the word limit;
// and checks the per-session memory (no resending). Overhead is estimated conservatively at 2.5 characters per
// token, which matched Claude Code's own /context count for this plugin's tool definitions. Search results are
// plain prose, capped at 4,800 characters (about 1,200 tokens at the usual 4 characters per token).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { loadKnowledge, wordCount, ENTRY_WORD_LIMIT } from "../lib/knowledge.mjs";

const ALWAYS_ON_TARGET = 1000, SEARCH_CAP_TOKENS = 1200, CHARS_PER_TOKEN = 2.5, SEARCH_CAP_CHARS = 4800, GET_CAP_CHARS = 3200; // keep in step with server/index.mjs
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rbrain-footprint-"));
const est = (s) => Math.ceil(s.length / CHARS_PER_TOKEN);

async function connect() {
  const env = { ...process.env, RBRAIN_HOME: path.join(tmp, "home"), RBRAIN_INBOX: path.join(tmp, "inbox"), RBRAIN_PROJECT_DIR: path.join(tmp, "proj") };
  delete env.RBRAIN_ENDPOINT;
  const client = new Client({ name: "footprint", version: "0" });
  await client.connect(new StdioClientTransport({ command: "node", args: [path.join(root, "server/index.mjs")], env }));
  return { client, call: async (name, args) => (await client.callTool({ name, arguments: args })).content[0].text };
}

try {
  // (a) always-on overhead
  let s = await connect();
  const tools = (await s.client.listTools()).tools;
  const skillDesc = fs.readFileSync(path.join(root, "skills/roblox-brain/SKILL.md"), "utf8").match(/^description:\s*(.*)$/m)[1];
  const alwaysOn = est(s.client.getInstructions() ?? "") + est(JSON.stringify(tools)) + est(skillDesc);
  assert.ok(alwaysOn <= ALWAYS_ON_TARGET, `always-on overhead ~${alwaysOn} tokens is over the ${ALWAYS_ON_TARGET}-token target`);

  // (b) every search stays under the hard cap, including the first one that carries the notice
  const entries = loadKnowledge(root);
  const queries = ["shop ui", "save player data", "particle burst", "lighting a scene", "combat hit feel", "remote validation", "mobile controls",
    ...entries.map((e) => `${e.meta.title} ${e.meta.tags ?? ""}`)];
  let maxSearch = 0;
  for (const [i, q] of queries.entries()) {
    if (i % 25 === 0) { await s.client.close(); s = await connect(); } // fresh sessions so memory doesn't shorten results
    const out = await s.call("search_knowledge", { query: q });
    maxSearch = Math.max(maxSearch, out.length);
    assert.ok(out.length <= SEARCH_CAP_CHARS, `search "${q.slice(0, 40)}" returned ${out.length} chars, over the cap`);
  }

  // per-session memory: an entry or a near-identical search isn't sent twice
  await s.client.close();
  s = await connect();
  await s.call("search_knowledge", { query: "warm up" }); // takes the once-per-project notice out of the way
  const first = await s.call("search_knowledge", { query: "save player data datastore" });
  assert.match(first, /\(datastores\/safe-saving\)/);
  assert.match(await s.call("search_knowledge", { query: "save player data datastore" }), /^Already answered for a near-identical search/);
  assert.doesNotMatch(first, /\(datastores\/safe-saving\) \[excerpt\]/, "the best match comes back in full");
  assert.match(await s.call("get_skill", { id: "datastores/safe-saving" }), /already provided in full earlier/, "the full best match isn't resent");
  assert.doesNotMatch(await s.call("get_skill", { id: "ui/no-blurry-ui" }), /already provided/);
  assert.match(await s.call("get_skill", { id: "ui/no-blurry-ui" }), /already provided in full earlier/);
  await s.client.close();

  // (c) entry length
  const tooLong = entries.filter((e) => wordCount(e) > ENTRY_WORD_LIMIT).map((e) => `${e.id} (${wordCount(e)})`);
  assert.deepEqual(tooLong, [], `entries over ${ENTRY_WORD_LIMIT} words: ${tooLong.join(", ")}`);
  // a full entry is never trimmed when sent, so code examples always arrive complete
  const trimmed = entries.filter((e) => `# ${e.meta.title}\n\n${e.body}`.length > GET_CAP_CHARS).map((e) => e.id);
  assert.deepEqual(trimmed, [], `entries over the ${GET_CAP_CHARS}-character full-entry cap: ${trimmed.join(", ")}`);

  console.log(`footprint test passed: always-on ~${alwaysOn} tokens (target ${ALWAYS_ON_TARGET}), largest search ${maxSearch} chars, ~${Math.ceil(maxSearch / 4)} tokens (cap ${SEARCH_CAP_CHARS} chars, ~${SEARCH_CAP_TOKENS} tokens), no entry over ${ENTRY_WORD_LIMIT} words or trimmed, no resending in a session`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
