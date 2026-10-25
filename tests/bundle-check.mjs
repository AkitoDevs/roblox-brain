// Dependency-free check of the bundled server: runs `node server/bundle.mjs` and speaks MCP JSON-RPC over stdio
// directly, so it works in a fresh clone with no node_modules. Uses a temp home; nothing is sent anywhere.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const server = path.join(root, "server", "bundle.mjs");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rbrain-bundle-"));
const env = { ...process.env, RBRAIN_HOME: path.join(tmp, "home"), RBRAIN_INBOX: path.join(tmp, "inbox") };
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
  const init = await request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "bundle-check", version: "0" } });
  assert.equal(init.serverInfo.name, "roblox-brain");
  assert.match(init.instructions ?? "", /call search_knowledge/);
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");

  const tools = (await request("tools/list")).tools.map((t) => t.name).sort();
  assert.deepEqual(tools, ["get_skill", "search_knowledge", "set_sharing", "sharing_status", "submit_lesson"]);
  assert.match(await call("search_knowledge", { query: "save player data datastore" }), /safe-saving|Safe player data saving/);
  assert.match(await call("search_knowledge", { query: "light rays window beams" }), /Light rays/);
  assert.match(await call("sharing_status"), /OFF/);
  assert.match(await call("submit_lesson", { topic: "ui/scaling", problem: "A list was clipped.", fix: "Use AutomaticSize on the container.", user_approved: true }), /sharing is OFF/);
  assert.ok(!fs.existsSync(path.join(tmp, "inbox")), "nothing written while sharing is off");
  console.log("bundle check passed: no node_modules needed; instructions, 5 tools, search, consent gate");
} finally {
  child.kill();
  fs.rmSync(tmp, { recursive: true, force: true });
}
