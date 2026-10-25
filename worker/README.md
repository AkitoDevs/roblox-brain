# roblox-brain hosted inbox (Cloudflare Worker + D1)

`POST /lesson` runs the same gate as the MCP server, then appends to D1:

1. Body over **2 KB** → 413 (checked on Content-Length and while reading the stream).
2. Must be a JSON object with a 16-hex-char `install` id → else 400.
3. `validateLesson()` from `src/lib/lesson.mjs`, a **byte-identical copy** of `../lib/lesson.mjs` + `../lib/safety.mjs`
   (`npm test` fails if they drift; `npm run sync-lib` re-copies). Default blocklist ships with the code;
   private terms come from the `BLOCKLIST` secret. Rejections → 400 with the reasons.
4. **20 lessons per install per day** → 429 after that (one SQL statement, so it can't be raced).
5. Stored row = `install`, `day` (UTC date, set by the server), cleaned `lesson`. No IP, no timestamp, no headers.
   Worker observability/logs are turned off in `wrangler.toml`.

Note: Cloudflare's network still sees the caller's IP while handling the request (any host does); the Worker just never reads or stores it.

## Tested locally (no account needed)
```
npm install
npm test                                   # handler tests with an in-memory D1 stand-in
npm run db:init:local && npm run dev       # real workerd + local D1 on :8787
npm run export-inbox -- --local            # local D1 -> ../inbox/<day>.jsonl
```

## Deploy steps (the owner runs these; nothing has been deployed)
```
cd worker
npx wrangler login                                   # 1. opens the browser; your Cloudflare account
npx wrangler d1 create rbrain-inbox                  # 2. prints a database_id
#    3. paste that id into wrangler.toml -> database_id
npm run db:init:remote                               # 4. create the table in the real D1
Get-Content ..\blocklist.private.txt -Raw | npx wrangler secret put BLOCKLIST   # 5. private terms (never committed); PowerShell form
npm run deploy                                       # 6. prints https://roblox-brain-inbox.<you>.workers.dev
```
7. The plugin's endpoint is that URL + `/lesson`: set it as `RBRAIN_ENDPOINT` in `../.mcp.json`'s `env` block.

Re-run step 5 whenever `blocklist.private.txt` changes. After editing `../lib/`, run `npm run sync-lib`, `npm test`, then `npm run deploy`.

## Weekly review
```
cd worker && npm run export-inbox -- --remote        # D1 -> ../inbox/*.jsonl, marks rows exported
cd .. && npm run triage                              # inbox -> candidates/, then follow triage/TRIAGE.md
```
Exported rows stay in D1 with `exported = 1`. Nothing is ever merged into `knowledge/` automatically.
