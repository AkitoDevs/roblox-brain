// Shutdown paths of the real MCP server against a local fake endpoint: an HTTP 410 turns sharing off for good with
// one message; network/server failures turn it off only after 5 attempts across 3 different days, with one message.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENDED = "The Roblox Brain sharing service has ended, so sharing has been turned off. The knowledge in the plugin keeps working.";
const UNAVAILABLE = "The Roblox Brain sharing service is no longer available, so sharing has been turned off. The knowledge in the plugin keeps working.";
const good = { topic: "ui/scaling", problem: "Last list item was clipped inside a CanvasGroup.", fix: "Use AutomaticSize on the container and a UIListLayout instead of a fixed height." };

let mode = 201;
const server = http.createServer((req, res) => {
  req.resume();
  req.on("end", () => {
    if (mode === "drop") return req.socket.destroy();
    res.writeHead(mode, { "content-type": "application/json" });
    res.end(JSON.stringify(mode === 410 ? { ok: false, error: "The Roblox Brain sharing service has ended." } : { ok: mode < 400, deleted: 0 }));
  });
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const endpoint = `http://127.0.0.1:${server.address().port}/lesson`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rbrain-shutdown-"));

async function session(home, day) {
  const project = path.join(tmp, "proj-ok");
  fs.mkdirSync(project, { recursive: true });
  const env = { ...process.env, RBRAIN_HOME: home, RBRAIN_PROJECT_DIR: project, RBRAIN_ENDPOINT: endpoint, RBRAIN_MIN_GAP_MS: "0", RBRAIN_TODAY: day };
  delete env.RBRAIN_DELETE_ENDPOINT; delete env.RBRAIN_INBOX;
  const client = new Client({ name: "shutdown", version: "0" });
  await client.connect(new StdioClientTransport({ command: "node", args: [path.join(root, "server/index.mjs")], env }));
  const call = async (name, args = {}) => (await client.callTool({ name, arguments: args })).content[0].text;
  await call("search_knowledge", { query: "scaling" }); // delivers the notice so sharing is allowed
  return { client, call };
}
const config = (home) => JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8"));
const countMsg = (texts, msg) => texts.filter((t) => t.includes(msg)).length;

try {
  // --- 410: sharing off for good, one plain message, never shown while things work
  {
    const home = path.join(tmp, "home-410");
    const s = await session(home, "2026-10-25");
    mode = 201;
    const ok = await s.call("submit_lesson", good);
    assert.ok(!ok.includes(ENDED) && !ok.includes(UNAVAILABLE), "no message while sharing works");
    mode = 410;
    const ended = await s.call("submit_lesson", { ...good, problem: "Another clipped list inside a scroll frame." });
    assert.equal(countMsg([ended], ENDED), 1, "the ended message is returned once");
    assert.equal(config(home).share, false);
    assert.equal(config(home).service_ended, true);
    const after = [await s.call("submit_lesson", good), await s.call("sharing_status"), await s.call("search_knowledge", { query: "ui" })];
    assert.equal(countMsg(after, ENDED), 0, "the message isn't repeated");
    assert.match(after[0], /sharing is off/);
    assert.match(await s.call("set_sharing", { enabled: true }), /has ended, so sharing can't be turned back on/);
    assert.equal(config(home).share, false, "stays off for good");
    await s.client.close();
  }

  // --- failsafe: one failure never turns sharing off; 5 failures over only 2 days don't either
  {
    const home = path.join(tmp, "home-fail");
    const seen = [];
    let s = await session(home, "2026-10-20");
    mode = 500;
    seen.push(await s.call("submit_lesson", good));
    assert.equal(config(home).share, true, "a single failure never turns sharing off");
    for (let i = 0; i < 3; i++) seen.push(await s.call("submit_lesson", good));
    await s.client.close();
    s = await session(home, "2026-10-21");
    mode = "drop"; // network error
    seen.push(await s.call("submit_lesson", good));
    assert.equal(config(home).share, true, "5 failures on only 2 days: still on");
    assert.equal(countMsg(seen, UNAVAILABLE), 0, "no message yet");
    await s.client.close();
    // a third day: now 6 failures over 3 days -> off, with one message
    s = await session(home, "2026-10-23");
    mode = 503;
    const last = await s.call("submit_lesson", good);
    assert.equal(countMsg([last], UNAVAILABLE), 1, "the unavailable message is returned once");
    assert.equal(config(home).share, false);
    assert.equal(countMsg([await s.call("submit_lesson", good), await s.call("sharing_status")], UNAVAILABLE), 0, "not repeated");
    // the user can turn it back on later (unlike a 410)
    assert.match(await s.call("set_sharing", { enabled: true }), /sharing is on/);
    await s.client.close();
  }

  // --- a success clears earlier failures
  {
    const home = path.join(tmp, "home-reset");
    let s = await session(home, "2026-10-20");
    mode = 500;
    for (let i = 0; i < 4; i++) await s.call("submit_lesson", good);
    await s.client.close();
    s = await session(home, "2026-10-21");
    mode = 201;
    await s.call("submit_lesson", good);
    assert.deepEqual(config(home).failures, [], "success clears the failure record");
    await s.client.close();
  }
  console.log("shutdown tests passed: 410 turns sharing off for good with one message, failsafe needs 5 failures over 3 days, one message, success resets");
} finally {
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}
