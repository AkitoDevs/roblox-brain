// Weekly export for review, with retention built in:
//   1. applies "delete my shared tips" requests to the maintainer's local copies (inbox/*.jsonl, inbox/processed/)
//   2. deletes anything older than the retention period (90 days) from D1 and from local processed files
//   3. copies new lessons from D1 into ../inbox/<day>.jsonl (the format tools/triage.mjs reads)
//   4. deletes the exported lessons from D1, so nothing stays on the server once it has been taken for review
// Usage:  npm run export-inbox -- --remote     (the deployed D1)
//         npm run export-inbox -- --local      (wrangler dev's local D1, for testing)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const worker = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inbox = process.env.RBRAIN_INBOX ?? path.join(worker, "..", "inbox");
const RETENTION_DAYS = 90;
const mode = process.argv.find((a) => a === "--remote" || a === "--local");
if (!mode) {
  console.error("Pass --remote (deployed D1) or --local (wrangler dev's local D1).");
  process.exit(1);
}

const wrangler = path.join(worker, "node_modules", "wrangler", "bin", "wrangler.js");
function d1(sql) {
  const out = execFileSync(process.execPath, [wrangler, "d1", "execute", "rbrain-inbox", mode, "--json", "--command", sql], { cwd: worker, encoding: "utf8", env: { ...process.env, WRANGLER_SEND_METRICS: "false" } });
  return JSON.parse(out.replace(/^﻿/, ""))[0];
}
const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400000).toISOString().slice(0, 10);
const jsonlFiles = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".jsonl")).map((f) => path.join(dir, f)) : []);

// 1. deletion requests -> purge matching lines from local review copies, then clear the requests
const reqs = d1("SELECT id, install FROM deletion_requests ORDER BY id").results ?? [];
let purged = 0;
if (reqs.length) {
  const gone = new Set(reqs.map((r) => r.install));
  for (const f of [...jsonlFiles(inbox), ...jsonlFiles(path.join(inbox, "processed"))]) {
    const lines = fs.readFileSync(f, "utf8").split("\n").filter(Boolean);
    const keep = lines.filter((l) => { try { return !gone.has(JSON.parse(l).install); } catch { return true; } });
    if (keep.length !== lines.length) { purged += lines.length - keep.length; fs.writeFileSync(f, keep.length ? keep.join("\n") + "\n" : ""); }
  }
  d1(`DELETE FROM deletion_requests WHERE id <= ${Number(reqs[reqs.length - 1].id)}`);
}

// 2. retention: nothing older than 90 days on the server or in processed local copies
const expired = d1(`DELETE FROM lessons WHERE day < '${cutoff}'`).meta?.changes ?? 0;
let expiredLocal = 0;
for (const f of jsonlFiles(path.join(inbox, "processed"))) {
  if (path.basename(f, ".jsonl") < cutoff) { fs.rmSync(f); expiredLocal++; }
}

// 3 + 4. export new lessons, then delete them from the server
const rows = d1("SELECT id, install, day, lesson FROM lessons ORDER BY id").results ?? [];
const housekeeping = `Deletion requests applied: ${reqs.length} (${purged} local cop${purged === 1 ? "y" : "ies"} removed). Older than ${RETENTION_DAYS} days removed: ${expired} on the server, ${expiredLocal} local file(s).`;
if (!rows.length) {
  console.log(`Export: no new lessons. ${housekeeping}`);
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
d1(`DELETE FROM lessons WHERE id <= ${Number(rows[rows.length - 1].id)}`);
console.log(`Export: ${rows.length} lessons -> ${[...byDay.keys()].map((d) => `inbox/${d}.jsonl`).join(", ")} (removed from the server). ${housekeeping} Now run: npm run triage`);
