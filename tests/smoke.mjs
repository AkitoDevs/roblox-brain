// End-to-end smoke test: starts the real MCP server over stdio and exercises every tool,
// including the privacy gates. Uses a temp home + temp inbox so nothing real is touched.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rbrain-"));
const inbox = path.join(tmp, "inbox");

const client = new Client({ name: "smoke", version: "0" });
await client.connect(new StdioClientTransport({
  command: "node",
  args: [path.join(root, "server/index.mjs")],
  env: { ...process.env, RBRAIN_HOME: path.join(tmp, "home"), RBRAIN_INBOX: inbox },
}));

const call = async (name, args = {}) => (await client.callTool({ name, arguments: args })).content[0].text;
const good = { topic: "ui/scaling", problem: "Last list item was clipped inside a CanvasGroup.", fix: "Use AutomaticSize on the container and a UIListLayout instead of a fixed height.", apis: ["CanvasGroup", "UIListLayout"], outcome: "ran_clean", user_approved: true };

// Server instructions reach the client on connect: search first, and the consent rules.
const instructions = client.getInstructions() ?? "";
assert.match(instructions, /BEFORE writing.*Roblox or Luau code.*call search_knowledge/s);
assert.match(instructions, /OFF by default/);
assert.match(instructions, /Never call set_sharing unless the user explicitly asks/);
assert.match(instructions, /show the user the exact lesson text and get a clear yes/);

const tools = (await client.listTools()).tools.map((t) => t.name).sort();
assert.deepEqual(tools, ["get_skill", "search_knowledge", "set_sharing", "sharing_status", "submit_lesson"]);

assert.match(await call("search_knowledge", { query: "save player data datastore" }), /safe-saving|Safe player data saving/);
assert.match(await call("search_knowledge", { query: "responsive mobile ui" }), /Responsive UI scaling/);
assert.match(await call("get_skill", { id: "security/remote-validation" }), /Validating remotes/);

assert.match(await call("sharing_status"), /OFF/);
assert.match(await call("submit_lesson", good), /sharing is OFF/);               // default: nothing is sent
assert.ok(!fs.existsSync(inbox));

await call("set_sharing", { enabled: true });
assert.match(await call("submit_lesson", good), /submitted anonymously/);          // valid lesson goes through

for (const [label, bad] of [
  ["code fence", { ...good, fix: "Use ```local x = 1``` here" }],
  ["email", { ...good, problem: "Contact me at someone@example.com" }],
  ["link", { ...good, fix: "See https://example.com/page for details" }],
  ["id-like number", { ...good, problem: "Place 1234567890 broke" }],
  ["file path", { ...good, fix: "Edit C:\\Users\\me\\game\\main.lua" }],
  ["bad topic", { ...good, topic: "My Game!" }],
]) assert.match(await call("submit_lesson", bad), /Not sent/, `should reject: ${label}`);

const files = fs.readdirSync(inbox);
assert.equal(files.length, 1);
const lines = fs.readFileSync(path.join(inbox, files[0]), "utf8").trim().split("\n");
assert.equal(lines.length, 1, "only the one valid lesson was stored");
const rec = JSON.parse(lines[0]);
assert.deepEqual(Object.keys(rec).sort(), ["apis", "fix", "install", "outcome", "problem", "received", "topic"]);
assert.ok(!("user_approved" in rec));

await call("set_sharing", { enabled: false });
assert.match(await call("submit_lesson", good), /sharing is OFF/);

await client.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log("smoke test passed: tools, search, consent gate, validation gate, anonymous record shape");
