// Prints LOGGED_IN or NOT_LOGGED_IN for Cloudflare (wrangler whoami) and exits 0 or 1.
// Never prints tokens, emails or account ids. /review-lessons runs this before exporting the inbox.
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const worker = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wrangler = path.join(worker, "node_modules", "wrangler", "bin", "wrangler.js");
const r = spawnSync(process.execPath, [wrangler, "whoami"], { cwd: worker, encoding: "utf8", env: { ...process.env, WRANGLER_SEND_METRICS: "false" }, timeout: 60000 });
const out = `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
const loggedIn = r.status === 0 && /You are logged in/i.test(out) && !/not authenticated|expired|log in again|please run .?wrangler login/i.test(out);
console.log(loggedIn ? "LOGGED_IN" : "NOT_LOGGED_IN");
process.exit(loggedIn ? 0 : 1);
