// Tests for the hosted inbox handler with an in-memory stand-in for D1 (the real D1 path is
// covered by running `wrangler dev --local`, see README). Also checks the lib copies match lib/.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { handle, parseTerms, MAX_PER_DAY } from "../src/handler.mjs";
import { FILES } from "../scripts/sync-lib.mjs";

const worker = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(worker, "..");

// --- the Worker's lib files are byte-identical copies of the originals (no loosened rules)
for (const [from, to] of FILES) {
  assert.equal(fs.readFileSync(path.join(worker, "src/lib", to), "utf8"), fs.readFileSync(path.join(root, from), "utf8"), `worker/src/lib/${to} drifted from ${from}: run npm run sync-lib`);
}

// In-memory D1 stand-in: understands only the handler's one INSERT ... WHERE count < cap.
function fakeDB() {
  const rows = [];
  return {
    rows,
    prepare: (sql) => ({
      bind: (install, day, lesson, cap) => ({
        run: async () => {
          assert.match(sql, /INSERT INTO lessons/);
          if (rows.filter((r) => r.install === install && r.day === day).length >= cap) return { meta: { changes: 0 } };
          rows.push({ install, day, lesson });
          return { meta: { changes: 1 } };
        },
      }),
    }),
  };
}

const URL_ = "https://inbox.example/lesson";
const post = (body, headers = {}) => new Request(URL_, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
const install = "0123456789abcdef";
const good = { topic: "ui/scaling", problem: "Last list item was clipped inside a CanvasGroup.", fix: "Use AutomaticSize on the container and a UIListLayout instead of a fixed height.", apis: ["CanvasGroup", "UIListLayout"], outcome: "ran_clean", install, received: "1999-01-01" };
const terms = parseTerms("# comment\npassword\n", "My-Secret-Game\r\n");
assert.deepEqual(terms, ["password", "my-secret-game"]);

// --- a clean lesson is stored: cleaned fields only, server-side date, no IP / extra fields
let env = { DB: fakeDB() };
let r = await handle(post({ ...good, ip: "1.2.3.4", user_approved: true, timestamp: "x" }), env, terms, "2026-10-25");
assert.equal(r.status, 201);
assert.equal(env.DB.rows.length, 1);
const row = env.DB.rows[0];
assert.deepEqual(Object.keys(row).sort(), ["day", "install", "lesson"]);
assert.equal(row.day, "2026-10-25", "date comes from the server, not the client");
assert.deepEqual(Object.keys(JSON.parse(row.lesson)).sort(), ["apis", "fix", "outcome", "problem", "topic"]);

// --- same rejections as the MCP server
for (const [label, bad] of [
  ["code fence", { ...good, fix: "Use ```local x = 1``` here" }],
  ["email", { ...good, problem: "Contact me at someone@example.com" }],
  ["link", { ...good, fix: "See https://example.com/page for details" }],
  ["id-like number", { ...good, problem: "Place 1234567890 broke" }],
  ["file path", { ...good, fix: "Edit C:\\Users\\me\\game\\main.lua" }],
  ["@handle", { ...good, problem: "Reported by @coolbuilder99 earlier" }],
  ["bad topic", { ...good, topic: "My Game!" }],
  ["too long", { ...good, problem: "x".repeat(301) }],
  ["private term", { ...good, problem: "Happened in my-secret-game today" }],
  ["default term", { ...good, fix: "Put the password in a ModuleScript" }],
  ["missing install", { ...good, install: undefined }],
  ["bad install", { ...good, install: "not-an-id" }],
]) {
  const res = await handle(post(bad), env, terms, "2026-10-25");
  assert.equal(res.status, 400, `should reject: ${label}`);
}
assert.equal((await handle(post("not json"), env, terms)).status, 400);
assert.equal((await handle(post("[1,2]"), env, terms)).status, 400);
assert.equal(env.DB.rows.length, 1, "rejected lessons are never stored");

// --- body over 2 KB is refused, with or without a Content-Length header
const big = JSON.stringify({ ...good, pad: "x".repeat(2100) });
assert.equal((await handle(post(big), env, terms)).status, 413);
const streamed = new Request(URL_, { method: "POST", body: new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(big)); c.close(); } }), duplex: "half" });
assert.equal(streamed.headers.get("content-length"), null);
assert.equal((await handle(streamed, env, terms)).status, 413);

// --- 20 per install per day, then 429; other installs and the next day are unaffected
env = { DB: fakeDB() };
for (let i = 0; i < MAX_PER_DAY; i++) assert.equal((await handle(post(good), env, terms, "2026-10-25")).status, 201);
assert.equal((await handle(post(good), env, terms, "2026-10-25")).status, 429);
assert.equal((await handle(post({ ...good, install: "fedcba9876543210" }), env, terms, "2026-10-25")).status, 201);
assert.equal((await handle(post(good), env, terms, "2026-10-26")).status, 201);

// --- routing
assert.equal((await handle(new Request(URL_), env, terms)).status, 405);
assert.equal((await handle(new Request("https://inbox.example/other", { method: "POST" }), env, terms)).status, 404);

// --- per-connection burst limit: key is a hash (never the raw address); over the limit = 429 and nothing stored
const seen = [];
const limiter = (max) => { const n = new Map(); return { limit: async ({ key }) => { seen.push(key); n.set(key, (n.get(key) ?? 0) + 1); return { success: n.get(key) <= max }; } }; };
env = { DB: fakeDB(), RATE_LIMITER: limiter(2) };
const fromAddr = (addr) => post(good, { "cf-connecting-ip": addr });
assert.equal((await handle(fromAddr("203.0.113.7"), env, terms, "2026-10-25")).status, 201);
assert.equal((await handle(fromAddr("203.0.113.7"), env, terms, "2026-10-25")).status, 201);
assert.equal((await handle(fromAddr("203.0.113.7"), env, terms, "2026-10-25")).status, 429);
assert.equal((await handle(fromAddr("198.51.100.9"), env, terms, "2026-10-25")).status, 201, "other connections unaffected");
assert.equal(env.DB.rows.length, 3, "rate-limited request not stored");
assert.ok(seen.every((k) => /^[0-9a-f]{64}$/.test(k) && !k.includes("203")), "limiter only ever sees a hash");
assert.ok(env.DB.rows.every((r) => !JSON.stringify(r).includes("203.0.113.7")), "no address stored");

console.log("worker tests passed: lib copies match, validation, 2 KB cap, install id, daily cap, stored shape, routing, burst limit");
