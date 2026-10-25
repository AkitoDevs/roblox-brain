// Worker entry. Default blocklist ships with the code; private terms come from the BLOCKLIST secret.
import { handle, parseTerms, retention } from "./handler.mjs";
import defaultBlocklist from "./lib/blocklist.default.txt";

export default {
  async fetch(request, env) {
    return handle(request, env, parseTerms(defaultBlocklist, env.BLOCKLIST));
  },
  // Daily cron (wrangler.toml [triggers]): delete anything older than the retention period.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(retention(env));
  },
};
