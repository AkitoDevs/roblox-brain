// Dependency-free tests for the privacy-critical logic: lesson validation, safety scan, search, triage.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validateLesson } from "../lib/lesson.mjs";
import { findIssues } from "../lib/safety.mjs";
import { loadKnowledge, search } from "../lib/knowledge.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const good = { topic: "ui/scaling", problem: "Last list item was clipped inside a CanvasGroup.", fix: "Use AutomaticSize on the container and a UIListLayout instead of a fixed height.", apis: ["CanvasGroup", "UIListLayout"], outcome: "ran_clean" };

// --- validation accepts a clean lesson and strips unknown fields
const v = validateLesson({ ...good, evil_extra: "x", user_approved: true });
assert.ok(v.ok, v.errors.join());
assert.deepEqual(Object.keys(v.lesson).sort(), ["apis", "fix", "outcome", "problem", "topic"]);

// --- validation rejects anything identifying or code-like
const bad = {
  "code fence": { ...good, fix: "Use ```local x = 1``` here" },
  email: { ...good, problem: "Contact me at someone@example.com" },
  link: { ...good, fix: "See https://example.com/page for details" },
  "id-like number": { ...good, problem: "Place 1234567890 broke" },
  "file path": { ...good, fix: "Edit C:\\Users\\me\\game\\main.lua" },
  "unix path": { ...good, fix: "Edit /home/me/game/main.lua" },
  "asset id": { ...good, fix: "Use rbxassetid://12345" },
  "@handle": { ...good, problem: "Reported by @coolbuilder99 earlier" },
  "bad topic": { ...good, topic: "My Game!" },
  "too long": { ...good, problem: "x".repeat(301) },
  "missing fix": { topic: "ui/scaling", problem: "something" },
  "token-like": { ...good, fix: "key is abcdefghijklmnopqrstuvwxyz0123456789ABCD" },
};
for (const [label, l] of Object.entries(bad)) assert.equal(validateLesson(l).ok, false, `should reject: ${label}`);

// --- private blocklist terms are enforced
assert.equal(validateLesson({ ...good, problem: "Happened in my-secret-game today" }, ["my-secret-game"]).ok, false);

// --- knowledge may cite links, but not personal data
assert.deepEqual(findIssues("See https://create.roblox.com/docs for details."), []);
assert.ok(findIssues("mail me at a@b.com").length > 0);

// --- search finds the right entries
const entries = loadKnowledge(root);
assert.ok(entries.length >= 4);
assert.equal(search(entries, "save player data")[0].id, "datastores/safe-saving");
assert.equal(search(entries, "remote exploit validate")[0].id, "security/remote-validation");
assert.equal(search(entries, "mobile responsive gui")[0].id, "ui/scaling");
assert.equal(search(entries, "wait spawn deprecated")[0].id, "engine-facts/deprecated-apis");

// --- triage: dedupes repeats across installs, rejects junk, never touches knowledge/
const inbox = fs.mkdtempSync(path.join(os.tmpdir(), "rbrain-inbox-"));
const rec = (install, over = {}) => JSON.stringify({ ...good, install, received: "2026-10-25", ...over });
fs.writeFileSync(path.join(inbox, "2026-10-25.jsonl"), [
  rec("aaaa"), rec("bbbb"), rec("cccc", { fix: "Use AutomaticSize on the container with a UIListLayout rather than fixed height." }),
  rec("dddd", { fix: "email me at x@y.com" }),   // should be rejected
  "not json",                                    // should be rejected
].join("\n") + "\n");
const before = fs.readdirSync(path.join(root, "candidates")).filter((f) => f.endsWith(".json"));
const out = execFileSync("node", [path.join(root, "tools/triage.mjs")], { env: { ...process.env, RBRAIN_INBOX: inbox }, encoding: "utf8" });
assert.match(out, /5 submissions -> 1 candidates, 2 rejected/);
const made = fs.readdirSync(path.join(root, "candidates")).filter((f) => f.endsWith(".json") && !before.includes(f));
assert.equal(made.length, 1);
const cand = JSON.parse(fs.readFileSync(path.join(root, "candidates", made[0]), "utf8"));
assert.equal(cand.reports, 3);
assert.equal(cand.independent_installs, 3);
assert.equal(cand.status, "needs_review");
assert.ok(fs.existsSync(path.join(inbox, "processed", "2026-10-25.jsonl")), "processed files are moved out of the inbox");

fs.rmSync(path.join(root, "candidates", made[0]));
fs.rmSync(inbox, { recursive: true, force: true });
console.log("lib tests passed: validation, safety scan, blocklist, search, triage");
