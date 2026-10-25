// Exports new lessons from the D1 inbox into ../inbox/<day>.jsonl (the format tools/triage.mjs reads),
// then marks them exported so the next run doesn't repeat them.
// Usage:  npm run export-inbox -- --remote     (the deployed D1)
//         npm run export-inbox -- --local      (wrangler dev's local D1, for testing)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const worker = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inbox = process.env.RBRAIN_INBOX ?? path.join(worker, "..", "inbox");
const mode = process.argv.find((a) => a === "--remote" || a === "--local");
if (!mode) {
  console.error("Pass --remote (deployed D1) or --local (wrangler dev's local D1).");
  process.exit(1);
}

const wrangler = path.join(worker, "node_modules", "wrangler", "bin", "wrangler.js");
function d1(sql) {
  const out = execFileSync(process.execPath, [wrangler, "d1", "execute", "rbrain-inbox", mode, "--json", "--command", sql], { cwd: worker, encoding: "utf8" });
  return JSON.parse(out)[0];
}

const rows = d1("SELECT id, install, day, lesson FROM lessons WHERE exported = 0 ORDER BY id").results ?? [];
if (!rows.length) {
  console.log("Export: no new lessons.");
  process.exit(0);
}

fs.mkdirSync(inbox, { recursive: true });
const byDay = new Map();
for (const r of rows) {
  // Same record shape the MCP server writes locally: lesson fields + install + received (date only).
  const rec = { ...JSON.parse(r.lesson), install: r.install, received: r.day };
  if (!byDay.has(r.day)) byDay.set(r.day, []);
  byDay.get(r.day).push(JSON.stringify(rec));
}
for (const [day, lines] of byDay) fs.appendFileSync(path.join(inbox, `${day}.jsonl`), lines.join("\n") + "\n");

const maxId = rows[rows.length - 1].id;
d1(`UPDATE lessons SET exported = 1 WHERE exported = 0 AND id <= ${Number(maxId)}`);
console.log(`Export: ${rows.length} lessons -> ${[...byDay.keys()].map((d) => `inbox/${d}.jsonl`).join(", ")}. Now run: npm run triage`);
