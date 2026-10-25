// Tests tools/sync-skills.mjs end to end against fake skills in a temp folder: auto-classification, line filtering,
// scans with --fix, apply, finish summary. Restores the one knowledge entry it touches.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rbrain-sync-"));
const own = path.join(tmp, "skills"), plugins = path.join(tmp, "plugins"), snaps = path.join(tmp, "snaps");
const mapFile = path.join(tmp, "map.json"), names = path.join(tmp, "names.txt");
const skill = (dir, name, body, extra = "") => { fs.mkdirSync(dir, { recursive: true }); const f = path.join(dir, "SKILL.md"); fs.writeFileSync(f, `---\nname: ${name}\ndescription: Roblox ${name}\n${extra}---\n${body}`); return f; };
const env = { ...process.env, RBRAIN_SYNC_MAP: mapFile, RBRAIN_SNAPSHOTS: snaps, RBRAIN_SKILL_ROOTS: own, RBRAIN_PLUGIN_ROOTS: plugins, RBRAIN_NAME_SCAN: names };
const run = (...a) => execFileSync("node", [path.join(root, "tools/sync-skills.mjs"), ...a], { env, encoding: "utf8", stdio: "pipe" });

const entry = path.join(root, "knowledge", "ui", "scaling.md");
const entryBefore = fs.readFileSync(entry, "utf8");
const draft = path.join(root, "candidates", "drafts", `sync-${new Date().toISOString().slice(0, 10)}`);
assert.ok(!fs.existsSync(draft), "a real sync draft for today already exists; finish it before running tests");

try {
  fs.writeFileSync(names, "SomeStudio\nFamousGame\n");
  // a mapped skill that changes after the last sync
  const oldText = "---\nname: ui-skill\n---\n# UI\n- Use Scale, not Offset.\n";
  const uiFile = skill(path.join(own, "ui-skill"), "ui-skill", "# UI\n- Use Scale, not Offset.\n");
  fs.writeFileSync(uiFile, oldText);
  fs.mkdirSync(snaps, { recursive: true });
  fs.writeFileSync(path.join(snaps, "ui-skill.md"), oldText);
  fs.writeFileSync(mapFile, JSON.stringify({ skills: { "ui-skill": { path: uiFile, synced: false, group: "shareable", sha256: crypto.createHash("sha256").update(oldText).digest("hex"), entries: ["ui/scaling"] } }, classified: {} }));
  assert.equal(run("status", "--count").trim(), "0");
  fs.appendFileSync(uiFile, "- Cap huge panels with a size constraint.\n- See https://example.com/guide for more.\n- As FamousGame does it.\n- Notes in [[My Private Note]].\n");
  assert.equal(run("status", "--count").trim(), "1");

  // new skills: one clean (shareable), one from a plugin, one with someone else's licence
  skill(path.join(own, "new-clean"), "new-clean", "# Tips\n- Anchor decor parts.\n- Turn CastShadow off on small decor.\n");
  skill(path.join(plugins, "pack", "skills", "plug-skill"), "plug-skill", "# From a plugin\n- Anything.\n");
  skill(path.join(own, "licensed", "inner"), "licensed-skill", "# Pack\n- Something.\n");
  fs.writeFileSync(path.join(own, "licensed", "LICENSE"), "MIT License\n");

  const prep = run("prepare");
  assert.match(prep, /USE ui-skill/);
  assert.match(prep, /USE new-clean \(shareable\)/);
  assert.match(prep, /SKIP plug-skill: third-party: comes from an installed plugin/);
  assert.match(prep, /SKIP licensed-skill: third-party: ships with someone else's licence file/);
  const usable = fs.readFileSync(path.join(draft, "usable", "ui-skill.txt"), "utf8");
  assert.match(usable, /Cap huge panels/);
  assert.doesNotMatch(usable, /example\.com|FamousGame|Private Note/, "borrowed, named and private lines are dropped");

  // a proposed entry update with one clean line and one line the scans must remove
  const proposed = path.join(draft, "knowledge", "ui", "scaling.md");
  fs.appendFileSync(proposed, "- Cap very large panels with a UISizeConstraint so they stay readable.\n- Copy the layout SomeStudio uses.\n");
  assert.throws(() => run("check", draft), (e) => /new line contains the name of another game, creator or brand/.test(e.stdout));
  assert.match(run("check", draft, "--fix"), /Check OK\. 1 entry changed or new/);
  assert.doesNotMatch(fs.readFileSync(proposed, "utf8"), /SomeStudio/);

  assert.match(run("apply", draft), /Applied: 1 updated, 0 new/);
  assert.match(fs.readFileSync(entry, "utf8"), /UISizeConstraint so they stay readable/);
  const summary = run("finish", draft);
  assert.match(summary, /Entries updated \(1\): ui\/scaling/);
  assert.match(summary, /Skills skipped \(2\)/);
  assert.match(summary, /Removed by the scans \(4\)/);
  assert.equal(run("status", "--count").trim(), "0", "synced skills are no longer reported as changed");
  console.log("sync tests passed: change detection, auto-classification, line filtering, scans with --fix, apply, summary");
} finally {
  fs.writeFileSync(entry, entryBefore);
  fs.rmSync(draft, { recursive: true, force: true });
  fs.rmSync(tmp, { recursive: true, force: true });
}
