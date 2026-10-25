// Mechanical pre-triage of the UNAPPROVED inbox. Your Claude then reviews candidates/ using triage/TRIAGE.md.
// - re-validates every lesson (never trust what is in the inbox)
// - flags near-duplicates of existing knowledge and merges repeats (more independent installs = higher confidence)
// - writes candidates/<topic>.json ; moves processed inbox files to inbox/processed/
// Nothing here edits knowledge/. Promotion is always a manual (or Claude-drafted, human-approved) step.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadKnowledge, tokenize } from "../lib/knowledge.mjs";
import { loadBlocklist } from "../lib/safety.mjs";
import { validateLesson } from "../lib/lesson.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inbox = process.env.RBRAIN_INBOX ?? path.join(root, "inbox");
const cand = path.join(root, "candidates");
const terms = loadBlocklist(root);
const knowledge = loadKnowledge(root);

const jaccard = (a, b) => {
  const A = new Set(a), B = new Set(b);
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / (A.size + B.size - inter || 1);
};
const sig = (l) => tokenize(`${l.problem} ${l.fix}`);

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
    status: "needs_review",
  }, null, 2));
}
if (files.length) {
  const done = path.join(inbox, "processed");
  fs.mkdirSync(done, { recursive: true });
  for (const f of files) fs.renameSync(path.join(inbox, f), path.join(done, f));
}
console.log(`Triage: ${total} submissions -> ${groups.length} candidates, ${rejected} rejected. See candidates/.`);
