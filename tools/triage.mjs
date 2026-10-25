// Mechanical pre-triage of the UNAPPROVED inbox. Your Claude then reviews candidates/ using triage/TRIAGE.md.
// - re-validates every lesson (never trust what is in the inbox)
// - flags near-duplicates of existing knowledge and merges repeats (more independent installs = higher confidence)
// - records which shared entries AND which of the maintainer's local skills each lesson relates to
// - writes candidates/<topic>.json ; moves processed inbox files to inbox/processed/
// Nothing here edits knowledge/ or any skill. Promotion is always a manual (or Claude-drafted, human-approved) step.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadKnowledge, tokenize } from "../lib/knowledge.mjs";
import { loadBlocklist } from "../lib/safety.mjs";
import { validateLesson } from "../lib/lesson.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inbox = process.env.RBRAIN_INBOX ?? path.join(root, "inbox");
const cand = path.join(root, "candidates");
const skillsConfig = process.env.RBRAIN_SKILLS_CONFIG ?? path.join(root, "triage", "skills.local.json");
const terms = loadBlocklist(root);
const knowledge = loadKnowledge(root);

const jaccard = (a, b) => {
  const A = new Set(a), B = new Set(b);
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / (A.size + B.size - inter || 1);
};
const sig = (l) => tokenize(`${l.problem} ${l.fix}`);

// Relatedness for long documents (skills, entries): share of the lesson's meaningful words found in the document,
// with a bonus when the lesson's topic words appear in the document's name.
const STOP = new Set("the and for with that this from into when then than are was were not but use used using its it's you your can".split(" "));
const content = (s) => tokenize(s).filter((t) => t.length > 2 && !STOP.has(t));
function related(lesson, docs) {
  const words = [...new Set(content(`${lesson.topic.replace(/[/-]/g, " ")} ${lesson.problem} ${lesson.fix} ${(lesson.apis ?? []).join(" ")}`))];
  const topicWords = content(lesson.topic.replace(/[/-]/g, " "));
  return docs
    .map((d) => {
      const hit = words.filter((w) => d.words.has(w)).length / (words.length || 1);
      const name = topicWords.filter((w) => d.nameWords.has(w)).length / (topicWords.length || 1);
      return { d, score: Math.round((0.8 * hit + 0.2 * name) * 100) / 100 };
    })
    .filter((x) => x.score >= 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

const entryDocs = knowledge.map((k) => ({ id: k.id, words: new Set(content(`${k.meta.title ?? ""} ${k.meta.tags ?? ""} ${k.body}`)), nameWords: new Set(content(`${k.id} ${k.meta.title ?? ""}`)) }));

// The maintainer's own skills, listed in a gitignored config (see triage/skills.local.json.example).
function loadSkills() {
  if (!fs.existsSync(skillsConfig)) return null;
  const { skills = [] } = JSON.parse(fs.readFileSync(skillsConfig, "utf8"));
  return skills.flatMap((s) => {
    const file = s.path.replace(/^~(?=[/\\])/, os.homedir());
    if (!fs.existsSync(file)) { console.warn(`skill not found, skipped: ${s.name}`); return []; }
    return [{ name: s.name, path: file, synced: !!s.synced, words: new Set(content(fs.readFileSync(file, "utf8"))), nameWords: new Set(content(s.name.replace(/-/g, " "))) }];
  });
}
const skillDocs = loadSkills();
if (!skillDocs) console.log(`No local skills config (${path.relative(root, skillsConfig)}); skill matching skipped.`);

const files = fs.existsSync(inbox) ? fs.readdirSync(inbox).filter((f) => f.endsWith(".jsonl")) : [];
const groups = []; // {lesson, installs:Set, count, similar_to}
let rejected = 0, total = 0;

for (const f of files) {
  for (const line of fs.readFileSync(path.join(inbox, f), "utf8").split("\n").filter(Boolean)) {
    total++;
    let rec; try { rec = JSON.parse(line); } catch { rejected++; continue; }
    const { ok, lesson } = validateLesson(rec, terms);
    if (!ok) { rejected++; continue; }
    const s = sig(lesson);
    const g = groups.find((x) => x.lesson.topic === lesson.topic && jaccard(sig(x.lesson), s) > 0.45);
    if (g) { g.count++; g.installs.add(rec.install); continue; }
    const best = knowledge.map((k) => ({ id: k.id, score: jaccard(tokenize(k.body), s) })).sort((a, b) => b.score - a.score)[0];
    groups.push({ lesson, installs: new Set([rec.install]), count: 1, similar_to: best && best.score > 0.08 ? best.id : null });
  }
}

fs.mkdirSync(cand, { recursive: true });
for (const g of groups) {
  const name = `${g.lesson.topic.replace(/\//g, "__")}__${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}.json`;
  fs.writeFileSync(path.join(cand, name), JSON.stringify({
    lesson: g.lesson,
    reports: g.count,
    independent_installs: g.installs.size,
    possibly_covered_by: g.similar_to,
    related_entries: related(g.lesson, entryDocs).map(({ d, score }) => ({ id: d.id, score })),
    related_skills: skillDocs ? related(g.lesson, skillDocs).map(({ d, score }) => ({ name: d.name, path: d.path, synced: d.synced, score })) : [],
    status: "needs_review",
  }, null, 2));
}
if (files.length) {
  const done = path.join(inbox, "processed");
  fs.mkdirSync(done, { recursive: true });
  for (const f of files) fs.renameSync(path.join(inbox, f), path.join(done, f));
}
console.log(`Triage: ${total} submissions -> ${groups.length} candidates, ${rejected} rejected. See candidates/.`);
