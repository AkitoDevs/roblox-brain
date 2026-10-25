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

// Extra rules for submitted lessons only (knowledge may cite docs links). Lessons are shared without a person
// reading each one first, so these are deliberately strict: anything borderline is dropped, not sent.
const LESSON_ONLY = [
  ["url", /https?:\/\/|\bwww\./i],
  ["domain name", /\b[a-z0-9-]+\.(com|net|org|io|gg|dev|app|co|me|xyz|tv|ly)\b/i],
  ["inline code", /`/],
  ["code-like syntax", /[{};]|==|~=|:=|\bfunction\s*\(|\blocal\s+\w+\s*=|\breturn\s+\w+\s*\(/],
  ["quoted text", /["“”«»][^"“”«»]{2,}["“”«»]/],
  ["file name", /\b[\w-]+\.(lua|luau|rbxl|rbxlx|rbxm|rbxmx|json|txt|md|png|jpe?g|fbx|obj|glb|js|ts|py|exe|zip)\b/i],
  ["path", /[A-Za-z]:[\\/]|(^|\s)\.\.?[\\/]|\\\\|\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+/],
  ["IP address", /\b\d{1,3}(\.\d{1,3}){3}\b/],
  ["number that could be an id", /\b\d{5,}\b/],
  ["something named", /\b(called|named|titled)\s+\S/i],
  ["mention of a specific project or account", /\b(my|our)\s+(game|games|place|experience|group|studio|shop|store|server|discord|channel|account|username|team|company|brand)\b/i],
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
