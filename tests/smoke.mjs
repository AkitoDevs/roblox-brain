// End-to-end smoke test: starts the real MCP server over stdio and exercises every tool, including the sharing
// rules. Uses a temp home, temp projects and a temp inbox, so nothing real is touched or sent.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rbrain-"));
const home = path.join(tmp, "home"), inbox = path.join(tmp, "inbox");
const history = path.join(home, "sent-lessons.md");
const projectA = path.join(tmp, "projects", "alpha-place"), projectB = path.join(tmp, "projects", "beta-place");
fs.mkdirSync(projectA, { recursive: true }); fs.mkdirSync(projectB, { recursive: true });

async function connect(projectDir) {
  const env = { ...process.env, RBRAIN_HOME: home, RBRAIN_INBOX: inbox, RBRAIN_PROJECT_DIR: projectDir, RBRAIN_MIN_GAP_MS: "0" };
  delete env.RBRAIN_ENDPOINT; delete env.RBRAIN_DELETE_ENDPOINT;
  const client = new Client({ name: "smoke", version: "0" });
  await client.connect(new StdioClientTransport({ command: "node", args: [path.join(root, "server/index.mjs")], env }));
  const call = async (name, args = {}) => (await client.callTool({ name, arguments: args })).content[0].text;
  return { client, call };
}
const inboxLines = () => (fs.existsSync(inbox) ? fs.readdirSync(inbox).flatMap((f) => fs.readFileSync(path.join(inbox, f), "utf8").split("\n").filter(Boolean)) : []);
const good = { topic: "ui/scaling", problem: "Last list item was clipped inside a CanvasGroup.", fix: "Use AutomaticSize on the container and a UIListLayout instead of a fixed height.", apis: ["CanvasGroup", "UIListLayout"], outcome: "ran_clean" };
const NOTICE_START = "Roblox Brain shares short tips to help improve the knowledge for everyone.";

const a = await connect(projectA);
// instructions describe default-on sharing, the notice and the user's commands
const instructions = a.client.getInstructions() ?? "";
assert.match(instructions, /BEFORE writing.*Roblox or Luau code.*call search_knowledge/s);
assert.match(instructions, /sharing is on by default/);
assert.match(instructions, /turn off Roblox Brain sharing/);
assert.match(instructions, /show my shared tips/);
assert.match(instructions, /delete my shared tips/);

const tools = (await a.client.listTools()).tools.map((t) => t.name).sort();
assert.deepEqual(tools, ["delete_shared_tips", "get_skill", "search_knowledge", "set_sharing", "sharing_status", "show_shared_tips", "submit_lesson"]);
assert.ok(!JSON.stringify((await a.client.listTools()).tools).includes("user_approved"), "no per-tip approval parameter");

// new project: nothing can be shared before the notice has been delivered
assert.match(await a.call("submit_lesson", good), /notice hasn't been shown in this project/);
assert.equal(inboxLines().length, 0);

// the first search in the project delivers the notice with the real paths; the second doesn't repeat it
const first = await a.call("search_knowledge", { query: "save player data datastore" });
assert.ok(first.includes(NOTICE_START), "notice delivered with the first search");
assert.ok(first.includes(`sharing history: ${history}`), "notice shows the real history path");
assert.ok(first.includes(path.join(root, "PRIVACY.md")), "notice links PRIVACY.md");
assert.match(first, /designed to leave out your code, names, ids, links and emails/);
assert.match(first, /safe-saving|Safe player data saving/);
assert.ok(!(await a.call("search_knowledge", { query: "responsive mobile ui" })).includes(NOTICE_START), "no repeat in the same project");
assert.match(await a.call("get_skill", { id: "security/remote-validation" }), /Validating remotes/);

// after the notice, a good tip is shared automatically; the first share returns the one-line note
const shared = await a.call("submit_lesson", good);
assert.match(shared, /Shared 1 short tip with the maintainer \(see your sharing history: .*sent-lessons\.md\)\. Say "turn off Roblox Brain sharing" to stop\./);
assert.equal(inboxLines().length, 1);
const rec = JSON.parse(inboxLines()[0]);
assert.deepEqual(Object.keys(rec).sort(), ["apis", "fix", "install", "outcome", "problem", "received", "topic"]);
const hist = fs.readFileSync(history, "utf8");
assert.ok(hist.indexOf(NOTICE_START) < hist.indexOf("## "), "the notice is at the top of the sharing history");
assert.match(hist, /## \d{4}-\d{2}-\d{2}: ui\/scaling\n- Problem: Last list item was clipped/);
assert.match(await a.call("submit_lesson", { ...good, problem: "Second tip about a clipped list in a scroll frame." }), /^Shared\. No need to mention it/);
assert.equal(inboxLines().length, 2);

// bad tips are dropped: identifying text, code, and the leak guard (project folder, user name, computer name)
for (const [label, bad] of [
  ["code", { ...good, fix: "Write frame.Size = UDim2.new(1, 0); then reparent" }],
  ["email", { ...good, problem: "Contact me at someone@example.com" }],
  ["link", { ...good, fix: "See https://example.com/page for details" }],
  ["id", { ...good, problem: "Place 1234567890 broke" }],
  ["named", { ...good, problem: "A model called Dragonkeep broke the layout" }],
  ["project folder", { ...good, problem: "In alpha-place the list was clipped." }],
  ["user name", { ...good, problem: `Seen on ${os.userInfo().username}'s setup.` }],
  ["computer name", { ...good, fix: `Tested on ${os.hostname()} only.` }],
]) assert.match(await a.call("submit_lesson", bad), /^Not shared/, `should drop: ${label}`);
assert.equal(inboxLines().length, 2, "nothing extra was shared");

// show my shared tips
assert.match(await a.call("show_shared_tips"), /Your sharing history .*\n[\s\S]*## \d{4}-\d{2}-\d{2}: ui\/scaling/);
await a.client.close();

// a different project gets the notice again
const b = await connect(projectB);
assert.ok((await b.call("sharing_status")).startsWith("[Roblox Brain sharing notice"), "new project shows the notice again");
assert.match(await b.call("sharing_status"), /^Roblox Brain sharing is on/);

// turning sharing off: nothing is shared and no notice appears anywhere
assert.match(await b.call("set_sharing", { enabled: false }), /off for every project/);
assert.match(await b.call("submit_lesson", good), /sharing is off/);
await b.client.close();
const c2 = await connect(path.join(tmp, "projects", "gamma"));
fs.mkdirSync(path.join(tmp, "projects", "gamma"), { recursive: true });
assert.ok(!(await c2.call("search_knowledge", { query: "save player data" })).includes(NOTICE_START), "no notice while sharing is off");
assert.match(await c2.call("submit_lesson", good), /sharing is off/);
assert.equal(inboxLines().length, 2, "nothing shared while off");

// delete my shared tips: removes every tip from this install, keeps others, and rotates the install id
fs.appendFileSync(path.join(inbox, "other.jsonl"), JSON.stringify({ ...good, install: "aaaaaaaaaaaaaaaa", received: "2026-10-25" }) + "\n");
const idBefore = JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8")).install_id;
assert.match(await c2.call("delete_shared_tips"), /^Deleted 2 shared tips/);
assert.equal(inboxLines().length, 1, "only the other install's tip is left");
assert.equal(JSON.parse(inboxLines()[0]).install, "aaaaaaaaaaaaaaaa");
assert.notEqual(JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8")).install_id, idBefore, "new install id after deleting");
assert.match(fs.readFileSync(history, "utf8"), /you asked to delete your shared tips/);
await c2.client.close();

fs.rmSync(tmp, { recursive: true, force: true });
console.log("smoke test passed: tools, search, notice once per project, block before notice, auto-share, history, filters + leak guard, off, show, delete");
