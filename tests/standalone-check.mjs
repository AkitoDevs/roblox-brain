// The plugin must run straight from readable source with plain `node` and no npm install. This check:
//   1. fails if server/ or lib/ imports anything other than Node built-ins and relative files;
//   2. copies only what the plugin ships at runtime into a temp folder (no node_modules anywhere near it), runs
//      `node server/index.mjs` there and speaks MCP JSON-RPC over stdio directly.
// Uses a temp home; nothing is sent anywhere.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RUNTIME = ["server", "lib", "knowledge", "PRIVACY.md", "blocklist.default.txt"];

// 1. imports: only node: built-ins and relative paths
const badImports = [];
for (const dir of ["server", "lib"]) {
  for (const f of fs.readdirSync(path.join(root, dir)).filter((x) => x.endsWith(".mjs"))) {
    const src = fs.readFileSync(path.join(root, dir, f), "utf8");
    for (const [, spec] of src.matchAll(/^\s*import\s[^"']*["']([^"']+)["']/gm)) {
      if (!spec.startsWith("node:") && !spec.startsWith(".")) badImports.push(`${dir}/${f} imports ${spec}`);
    }
  }
}
assert.deepEqual(badImports, [], "the plugin must run with no npm install");
assert.ok(!fs.existsSync(path.join(root, "server", "bundle.mjs")), "no generated bundle is shipped");

// 2. run the server from a clean copy
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rbrain-standalone-"));
const app = path.join(tmp, "plugin");
for (const p of RUNTIME) fs.cpSync(path.join(root, p), path.join(app, p), { recursive: true });
const server = path.join(app, "server", "index.mjs");
const env = { ...process.env, RBRAIN_HOME: path.join(tmp, "home"), RBRAIN_INBOX: path.join(tmp, "inbox"), RBRAIN_PROJECT_DIR: path.join(tmp, "proj"), RBRAIN_MIN_GAP_MS: "0" };
delete env.RBRAIN_ENDPOINT;

const child = spawn(process.execPath, [server], { env, stdio: ["pipe", "pipe", "pipe"] });
let buf = "", stderr = "";
const waiting = new Map();
child.stderr.on("data", (d) => (stderr += d));
child.stdout.on("data", (d) => {
  buf += d;
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    if (msg.id != null && waiting.has(msg.id)) { waiting.get(msg.id)(msg); waiting.delete(msg.id); }
  }
});
let nextId = 1;
const request = (method, params = {}) => new Promise((resolve, reject) => {
  const id = nextId++;
  const timer = setTimeout(() => reject(new Error(`timeout on ${method}; stderr: ${stderr}`)), 15000);
  waiting.set(id, (m) => { clearTimeout(timer); m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result); });
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
});
const call = async (name, args = {}) => (await request("tools/call", { name, arguments: args })).content[0].text;

try {
  const init = await request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "standalone-check", version: "0" } });
  assert.equal(init.protocolVersion, "2025-06-18");
  assert.equal(init.serverInfo.name, "roblox-brain");
  assert.match(init.instructions ?? "", /call search_knowledge/);
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");

  const tools = (await request("tools/list")).tools.map((t) => t.name).sort();
  assert.deepEqual(tools, ["get_skill", "search_knowledge", "sharing", "submit_lesson"]);
  assert.deepEqual(await request("ping"), {});
  const bad = await request("tools/call", { name: "sharing", arguments: { action: "explode" } });
  assert.equal(bad.isError, true, "bad arguments come back as a tool error");
  await assert.rejects(request("tools/call", { name: "no_such_tool", arguments: {} }), /Unknown tool/);
  const tip = { topic: "ui/scaling", problem: "A list was clipped inside a scroll frame.", fix: "Use AutomaticSize on the container." };
  assert.match(await call("submit_lesson", tip), /notice hasn't been shown/, "nothing shared before the notice");
  assert.ok(!fs.existsSync(path.join(tmp, "inbox")));
  const first = await call("search_knowledge", { query: "save player data datastore" });
  assert.match(first, /Roblox Brain shares short tips/, "notice comes with the first search");
  assert.match(first, /safe-saving|Safe player data saving/);
  assert.doesNotMatch(await call("search_knowledge", { query: "light rays window beams" }), /Roblox Brain shares short tips/);
  assert.match(await call("submit_lesson", tip), /Shared 1 short tip with the maintainer/);
  assert.equal(fs.readdirSync(path.join(tmp, "inbox")).length, 1, "shared into the temp inbox only");
  assert.match(await call("sharing", { action: "off" }), /off for every project/);
  assert.match(await call("submit_lesson", tip), /sharing is off/);
  console.log("standalone check passed: readable source, no npm install, no bundle; instructions, 4 tools, argument checks, notice before sharing, search, share, off");
} finally {
  child.kill();
  fs.rmSync(tmp, { recursive: true, force: true });
}
