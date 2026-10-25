# roblox-brain hosted inbox (Cloudflare Worker + D1)

**Live:** `https://roblox-brain-inbox.rb-inbox-9m2q.workers.dev/lesson` and `/delete` (only those paths answer; everything else is 404).
Preview URLs are off (`preview_urls = false`), so only this one address serves traffic.

`POST /lesson` runs the same gate as the MCP server, then appends to D1:

0. **5 lessons per minute per connection** → 429 after that (Workers Rate Limiting binding `RATE_LIMITER`).
   The counter key is a SHA-256 hash of the connecting address; it is never stored, logged or returned.
   Counters are per Cloudflare location and eventually consistent, so a burst fired in the same instant can
   slip a few extra through (tested live: 10 simultaneous requests all passed; 12 sequential ones gave 5 × 201 then 429s).
1. Body over **2 KB** → 413 (checked on Content-Length and while reading the stream).
2. Must be a JSON object with a 16-hex-char `install` id → else 400.
3. `validateLesson()` from `src/lib/lesson.mjs`, a **byte-identical copy** of `../lib/lesson.mjs` + `../lib/safety.mjs`
   (`npm test` fails if they drift; `npm run sync-lib` re-copies). Default blocklist ships with the code;
   private terms come from the `BLOCKLIST` secret. Rejections → 400 with the reasons.
4. **20 lessons per install per day** → 429 after that (one SQL statement, so it can't be raced).
5. Stored row = `install`, `day` (UTC date, set by the server), cleaned `lesson`. No IP, no timestamp, no headers.
   Worker observability/logs are turned off in `wrangler.toml`.

Note: Cloudflare's network still sees the caller's IP while handling the request (any host does); the Worker never stores it.

`POST /delete {"install": "<16 hex>"}` (same rate limit and body cap) deletes every row for that install id and nothing else,
answers `{"ok": true, "deleted": n}`, and records `(install, date)` in `deletion_requests` so the next export also purges
the maintainer's downloaded copies. The random install id, held only in the user's local config, is the proof.

**Shutdown switch:** `SERVICE_STATUS` in `wrangler.toml` `[vars]` (`"active"` by default). When it's `"ended"`, `/lesson` and
`/delete` answer **410** `{"ok": false, "error": "The Roblox Brain sharing service has ended."}` and plugins turn sharing off.
Use the `/sunset` command rather than changing it by hand.

**Retention:** a daily cron (`17 3 * * *` UTC) deletes lessons and deletion requests older than 90 days. The weekly export
deletes exported lessons from D1 right after copying them.

## Tested locally (no account needed)
```
npm install
npm test                                   # handler tests with an in-memory D1 stand-in
npm run db:init:local && npm run dev       # real workerd + local D1 on :8787
npm run export-inbox -- --local            # local D1 -> ../inbox/<day>.jsonl
```

## Deploy steps (already done once; kept for redeploys or a fresh account)
```
cd worker
npx wrangler login                                   # 1. opens the browser; your Cloudflare account
npx wrangler d1 create rbrain-inbox                  # 2. prints a database_id
#    3. paste that id into wrangler.toml -> database_id
npm run db:init:remote                               # 4. create the tables in the real D1 (if your login can't use D1
                                                     #    import, run each CREATE statement from schema.sql with --command)
Get-Content ..\blocklist.private.txt -Raw | npx wrangler secret put BLOCKLIST   # 5. private terms (never committed); PowerShell form
npm run deploy                                       # 6. prints https://roblox-brain-inbox.<you>.workers.dev
```
7. The plugin's endpoint is that URL + `/lesson`: set it as `RBRAIN_ENDPOINT` in `../.mcp.json`'s `env` block.

Re-run step 5 whenever `blocklist.private.txt` changes. After editing `../lib/`, run `npm run sync-lib`, `npm test`, then `npm run deploy`.

## Weekly review
PowerShell, starting in the repo root:
```
cd worker; npm run export-inbox -- --remote; cd ..   # 1. delete requests + 90-day retention, then D1 -> inbox/<day>.jsonl
                                                     #    and the exported rows are deleted from D1
npm run triage                                       # 2. inbox -> candidates/
```
3. Ask Claude to follow `triage/TRIAGE.md` on `candidates/` (drafts only, never edits `knowledge/`). `/review-lessons` does all of this.
4. Approve drafts into `knowledge/`, bump `knowledge/manifest.json`, `npm run build`, release.

Nothing is ever merged into `knowledge/` automatically.

## Removing test rows
Use a fixed fake install id for test lessons (e.g. `7e57000000000a01`), then delete exactly those rows:
```
npx wrangler d1 execute rbrain-inbox --remote --command "DELETE FROM lessons WHERE install = '7e57000000000a01'"
npx wrangler d1 execute rbrain-inbox --remote --command "SELECT COUNT(*) AS n FROM lessons"
```
