// Loads knowledge/*.md entries and does simple keyword search.
import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

/** Minimal front matter parser: --- key: value --- then body. */
export function parseEntry(raw, file) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { file, meta: {}, body: raw, error: "missing front matter" };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { file, meta, body: m[2].trim() };
}

export function loadKnowledge(root) {
  const dir = path.join(root, "knowledge");
  return walk(dir).map((f) => {
    const e = parseEntry(fs.readFileSync(f, "utf8"), path.relative(dir, f));
    e.id = e.file.split(path.sep).join("/").replace(/\.md$/, ""); // ids always use "/", also on Windows
    return e;
  });
}

// Entry length: aim for about 400 words (the build lists entries over this) and never more than the hard limit,
// so a get_skill result stays small in the user's context.
export const ENTRY_WORD_TARGET = 400, ENTRY_WORD_LIMIT = 450;
export const wordCount = (e) => e.body.split(/\s+/).filter(Boolean).length;

const tokenize =(s) => s.toLowerCase().match(/[a-z0-9_]{2,}/g) ?? [];

export function search(entries, query, limit = 5) {
  const q = new Set(tokenize(query));
  if (!q.size) return [];
  return entries
    .map((e) => {
      const title = tokenize(`${e.id} ${e.meta.title ?? ""} ${e.meta.tags ?? ""}`);
      const body = tokenize(e.body);
      let score = 0;
      for (const t of q) {
        if (title.includes(t)) score += 4;
        score += Math.min(body.filter((b) => b === t).length, 3);
      }
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.e);
}

export { tokenize };
