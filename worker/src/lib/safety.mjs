// Shared safety checks: used by the build step (knowledge entries),
// the MCP server (incoming lessons) and the triage script.
import fs from "node:fs";
import path from "node:path";

// Patterns that should never appear in shipped knowledge or in submitted lessons.
const ALWAYS = [
  ["email address", /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i],
  ["code fence", /```/],
  ["file path", /(?:\/Users\/|\/home\/|C:\\|~\/)/i],
  ["long token/secret-like string", /\b[A-Za-z0-9_\-]{32,}\b/],
  ["long digit run (id-like)", /\b\d{7,}\b/],
  ["asset/place id reference", /rbxassetid|rbxasset:\/\/|placeid\s*[:=]\s*\d+|universeid\s*[:=]\s*\d+/i],
  ["auth cookie", /roblosecurity/i],
  ["@handle", /(^|\s)@[A-Za-z0-9_]{3,}/],
];

// Extra rules for submitted lessons only (knowledge may cite docs links).
const LESSON_ONLY = [
  ["url", /https?:\/\//i],
  ["inline code block", /`[^`]{40,}`/],
];

/** Load default + private blocklist terms (private file is optional and gitignored). */
export function loadBlocklist(root) {
  const terms = [];
  for (const file of ["blocklist.default.txt", "blocklist.private.txt"]) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const t = line.trim();
      if (t && !t.startsWith("#")) terms.push(t.toLowerCase());
    }
  }
  return terms;
}

/** Returns a list of human-readable issues found in `text`. Empty list = clean. */
export function findIssues(text, terms = [], { lesson = false } = {}) {
  const issues = [];
  const rules = lesson ? [...ALWAYS, ...LESSON_ONLY] : ALWAYS;
  for (const [label, re] of rules) if (re.test(text)) issues.push(label);
  const lower = text.toLowerCase();
  for (const t of terms) if (lower.includes(t)) issues.push(`blocklisted term (${t.length} chars)`);
  return issues;
}
