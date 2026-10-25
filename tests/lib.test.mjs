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
// a stand-in for one of the maintainer's local skills (triage reads skills from a config, never from a fixed path)
const skillDir = path.join(inbox, "skills", "fake-ui-skill");
fs.mkdirSync(skillDir, { recursive: true });
const skillFile = path.join(skillDir, "SKILL.md");
fs.writeFileSync(skillFile, "---\nname: fake-ui-skill\n---\n# UI layout\n\n- Lists inside a CanvasGroup: use UIListLayout and AutomaticSize on the container.\n");
const skillsConfig = path.join(inbox, "skills.json");
fs.writeFileSync(skillsConfig, JSON.stringify({ skills: [
  { name: "fake-ui-skill", path: skillFile, synced: true },
  { name: "unrelated-skill", path: path.join(inbox, "skills", "missing", "SKILL.md") },
] }));
const before = fs.readdirSync(path.join(root, "candidates")).filter((f) => f.endsWith(".json"));
const out = execFileSync("node", [path.join(root, "tools/triage.mjs")], { env: { ...process.env, RBRAIN_INBOX: inbox, RBRAIN_SKILLS_CONFIG: skillsConfig }, encoding: "utf8" });
assert.match(out, /5 submissions -> 1 candidates, 2 rejected/);
const made = fs.readdirSync(path.join(root, "candidates")).filter((f) => f.endsWith(".json") && !before.includes(f));
assert.equal(made.length, 1);
const cand = JSON.parse(fs.readFileSync(path.join(root, "candidates", made[0]), "utf8"));
assert.equal(cand.reports, 3);
assert.equal(cand.independent_installs, 3);
assert.equal(cand.status, "needs_review");
assert.ok(fs.existsSync(path.join(inbox, "processed", "2026-10-25.jsonl")), "processed files are moved out of the inbox");
// --- triage records which shared entries and which local skills the lesson relates to
assert.equal(cand.related_entries[0].id, "ui/scaling");
assert.equal(cand.related_skills.length, 1);
assert.equal(cand.related_skills[0].name, "fake-ui-skill");
assert.equal(cand.related_skills[0].synced, true);

// --- drafts: refused until approved; scaffold + diff only ever write under candidates/drafts/
const candPath = path.join(root, "candidates", made[0]);
const draftDir = path.join(root, "candidates", "drafts", made[0].replace(/\.json$/, ""));
const draft = (...a) => execFileSync("node", [path.join(root, "tools/draft.mjs"), ...a, candPath], { encoding: "utf8", stdio: "pipe" });
assert.throws(() => draft(), /Only candidates the maintainer marked "approved"/);
fs.writeFileSync(candPath, JSON.stringify({ ...cand, status: "approved" }));
const entryPath = path.join(root, "knowledge", "ui", "scaling.md");
const entryBefore = fs.readFileSync(entryPath, "utf8"), skillBefore = fs.readFileSync(skillFile, "utf8");
assert.match(draft(), /Drafts scaffolded/);
assert.equal(fs.readFileSync(path.join(draftDir, "entry.proposed.md"), "utf8"), entryBefore);
assert.match(fs.readFileSync(path.join(draftDir, "DRAFT.md"), "utf8"), /SYNCED from your account/);
fs.appendFileSync(path.join(draftDir, "entry.proposed.md"), "- Draft line for the entry.\n");
fs.appendFileSync(path.join(draftDir, "skill.proposed.md"), "- Draft line for the skill.\n");
assert.match(draft("--diff"), /nothing was applied/);
assert.match(fs.readFileSync(path.join(draftDir, "entry.diff"), "utf8"), /^\+- Draft line for the entry\.$/m);
assert.match(fs.readFileSync(path.join(draftDir, "skill.diff"), "utf8"), /^\+- Draft line for the skill\.$/m);
assert.equal(fs.readFileSync(entryPath, "utf8"), entryBefore, "draft never edits knowledge/");
assert.equal(fs.readFileSync(skillFile, "utf8"), skillBefore, "draft never edits the skill");

fs.rmSync(draftDir, { recursive: true, force: true });
fs.rmSync(path.join(root, "candidates", made[0]));
fs.rmSync(inbox, { recursive: true, force: true });
console.log("lib tests passed: validation, safety scan, blocklist, search, triage, skill matching, drafts");
