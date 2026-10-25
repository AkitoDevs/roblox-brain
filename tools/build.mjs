// Validates every knowledge entry, then prints a PUBLISH REPORT so you can review exactly what ships.
// Fails (exit 1) if any entry is not `scope: generic`, or trips the safety scan / your private blocklist.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadKnowledge } from "../lib/knowledge.mjs";
import { loadBlocklist, findIssues } from "../lib/safety.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const terms = loadBlocklist(root);
const entries = loadKnowledge(root);
const REQUIRED = ["title", "topic", "scope", "source"];
const SOURCES = ["own-testing", "community-lesson", "roblox-docs"];

let failed = false;
console.log(`PUBLISH REPORT  (${entries.length} entries, ${terms.length} blocklist terms loaded)\n`);

for (const e of entries) {
  const problems = [];
  if (e.error) problems.push(e.error);
  for (const k of REQUIRED) if (!e.meta[k]) problems.push(`missing '${k}' in front matter`);
  if (e.meta.scope && e.meta.scope !== "generic") problems.push(`scope is '${e.meta.scope}', must be 'generic'`);
  if (e.meta.source && !SOURCES.includes(e.meta.source)) problems.push(`source must be one of ${SOURCES.join(", ")}`);
  for (const i of findIssues(`${JSON.stringify(e.meta)}\n${e.body}`, terms)) problems.push(`contains ${i}`);

  const words = e.body.split(/\s+/).length;
  console.log(`${problems.length ? "FAIL" : " ok "}  ${e.id}  (${words} words, source: ${e.meta.source ?? "?"})`);
  for (const p of problems) console.log(`        - ${p}`);
  if (problems.length) failed = true;
}

if (failed) {
  console.log("\nBuild FAILED. Fix the entries above before publishing.");
  process.exit(1);
}

const dist = path.join(root, "dist");
fs.mkdirSync(dist, { recursive: true });
const manifest = JSON.parse(fs.readFileSync(path.join(root, "knowledge/manifest.json"), "utf8"));
fs.writeFileSync(path.join(dist, "index.json"), JSON.stringify({ manifest, entries: entries.map((e) => ({ id: e.id, meta: e.meta, body: e.body })) }, null, 2));
console.log(`\nBuild OK -> dist/index.json  (knowledge v${manifest.version})`);
