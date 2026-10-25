// Copies lib/lesson.mjs, lib/safety.mjs and blocklist.default.txt into worker/src/lib/ unchanged,
// so the Worker runs exactly the same validation as the MCP server. Run after editing lib/.
// `npm test` fails if the copies drift from the originals.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const worker = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(worker, "..");
export const FILES = [["lib/lesson.mjs", "lesson.mjs"], ["lib/safety.mjs", "safety.mjs"], ["blocklist.default.txt", "blocklist.default.txt"]];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dest = path.join(worker, "src", "lib");
  fs.mkdirSync(dest, { recursive: true });
  for (const [from, to] of FILES) {
    fs.copyFileSync(path.join(root, from), path.join(dest, to));
    console.log(`copied ${from} -> worker/src/lib/${to}`);
  }
}
