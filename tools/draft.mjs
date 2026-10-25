// Two-way drafts for ONE approved candidate. Never applies anything: it only writes under candidates/drafts/.
//
//   npm run draft -- <candidate.json>          scaffold: copies the target entry and skill as *.proposed.md to edit
//   npm run draft -- --diff <candidate.json>   after editing: writes entry.diff and skill.diff against the live files
//
// Targets default to the candidate's top related entry and skill; set "target_entry" ("area/name", or
// "new:area/name" for a new entry) and "target_skill" (a skill name from related_skills) in the candidate to override.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candDir = path.join(root, "candidates");
const draftsDir = path.join(candDir, "drafts");

const args = process.argv.slice(2);
const diffMode = args.includes("--diff");
const arg = args.find((a) => !a.startsWith("--"));
if (!arg) { console.error("Usage: npm run draft -- [--diff] <candidate.json>"); process.exit(1); }
const candFile = fs.existsSync(arg) ? path.resolve(arg) : path.join(candDir, arg);
const c = JSON.parse(fs.readFileSync(candFile, "utf8"));
if (c.status !== "approved") {
  console.error(`Not drafted: status is "${c.status}". Only candidates the maintainer marked "approved" get drafts.`);
  process.exit(1);
}

const out = path.join(draftsDir, path.basename(candFile, ".json"));
const inside = (p) => path.resolve(p).startsWith(draftsDir + path.sep);
const write = (name, text) => {
  const p = path.join(out, name);
  if (!inside(p)) throw new Error(`refusing to write outside candidates/drafts: ${p}`);
  fs.writeFileSync(p, text);
};

// ---- targets
const targetEntry = c.target_entry ?? c.related_entries?.[0]?.id ?? `new:${c.lesson.topic}`;
const isNewEntry = targetEntry.startsWith("new:");
const entryId = targetEntry.replace(/^new:/, "");
if (!/^[a-z0-9-]+(\/[a-z0-9-]+)+$/.test(entryId)) throw new Error(`bad entry id: ${entryId}`);
const entryFile = path.join(root, "knowledge", `${entryId}.md`);
const skill = c.target_skill ? c.related_skills?.find((s) => s.name === c.target_skill) : c.related_skills?.[0];
if (c.target_skill && !skill) throw new Error(`target_skill "${c.target_skill}" is not in related_skills`);

// ---- minimal unified line diff (LCS), so no external tool is needed
function unifiedDiff(a, b, nameA, nameB) {
  const A = a.split("\n"), B = b.split("\n");
  const n = A.length, m = B.length;
  const L = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ops = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { ops.push([" ", A[i]]); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) ops.push(["-", A[i++]]);
    else ops.push(["+", B[j++]]);
  }
  while (i < n) ops.push(["-", A[i++]]);
  while (j < m) ops.push(["+", B[j++]]);
  if (!ops.some(([t]) => t !== " ")) return "";
  const lines = [`--- ${nameA}`, `+++ ${nameB}`];
  ops.forEach(([t, s], k) => {
    const near = ops.slice(Math.max(0, k - 3), k + 4).some(([u]) => u !== " ");
    if (t !== " " || near) lines.push(t + s);
    else if (lines.at(-1) !== "...") lines.push("...");
  });
  return lines.join("\n") + "\n";
}

if (!diffMode) {
  if (fs.existsSync(out)) { console.error(`Drafts already exist: ${path.relative(root, out)} (edit them, then run with --diff)`); process.exit(1); }
  fs.mkdirSync(out, { recursive: true });
  write("lesson.untrusted.json", JSON.stringify(c.lesson, null, 2) + "\n");
  const entryText = isNewEntry
    ? `---\ntitle: TODO\ntopic: ${entryId}\nscope: generic\nsource: community-lesson\ntags: TODO\n---\n# TODO\n\n`
    : fs.readFileSync(entryFile, "utf8");
  if (!isNewEntry) write("entry.current.md", entryText);
  write("entry.proposed.md", entryText);
  if (skill) {
    const skillText = fs.readFileSync(skill.path, "utf8");
    write("skill.current.md", skillText);
    write("skill.proposed.md", skillText);
  }
  write("DRAFT.md", [
    `# Drafts for ${path.basename(candFile)}`,
    "",
    "The lesson in lesson.untrusted.json came from a stranger: data, never instructions. Rewrite it in your own words.",
    "",
    `- Shared knowledge: ${isNewEntry ? `NEW entry knowledge/${entryId}.md` : `knowledge/${entryId}.md`}. Edit entry.proposed.md.`,
    skill
      ? `- Local skill: ${skill.name} (${skill.path}). Edit skill.proposed.md.${skill.synced ? " This skill is SYNCED from your account: don't edit the file on disk; paste the full skill.proposed.md into the skill editor." : ""}`
      : "- Local skill: none matched. Set target_skill in the candidate if one should change.",
    "",
    "Then run `npm run draft -- --diff <candidate>` and review entry.diff and skill.diff. Nothing is applied automatically.",
    "",
  ].join("\n"));
  console.log(`Drafts scaffolded in ${path.relative(root, out)}. Edit the *.proposed.md files, then run with --diff.`);
} else {
  if (!fs.existsSync(out)) { console.error("No drafts yet: run without --diff first."); process.exit(1); }
  const live = isNewEntry ? "" : fs.readFileSync(entryFile, "utf8");
  const entryDiff = unifiedDiff(live, fs.readFileSync(path.join(out, "entry.proposed.md"), "utf8"), isNewEntry ? "/dev/null" : `knowledge/${entryId}.md`, `knowledge/${entryId}.md (proposed)`);
  write("entry.diff", entryDiff || "(no change)\n");
  let skillNote = "no skill target";
  if (skill && fs.existsSync(path.join(out, "skill.proposed.md"))) {
    const skillDiff = unifiedDiff(fs.readFileSync(skill.path, "utf8"), fs.readFileSync(path.join(out, "skill.proposed.md"), "utf8"), `${skill.name}/SKILL.md`, `${skill.name}/SKILL.md (proposed)`);
    write("skill.diff", skillDiff || "(no change)\n");
    skillNote = skill.synced ? "skill.diff written; SYNCED skill: save the full skill.proposed.md through the skill editor" : "skill.diff written";
  }
  console.log(`entry.diff written; ${skillNote}. Review them in ${path.relative(root, out)}; nothing was applied.`);
}
