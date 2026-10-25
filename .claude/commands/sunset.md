---
description: Discontinue Roblox Brain sharing - end the live service, mark the repo discontinued, optionally delete stored tips, release, then archive. Confirms every step with the maintainer.
---

# /sunset

Shut down the Roblox Brain sharing service cleanly. **Ask the maintainer for a clear yes before each numbered step**, say in one line what the step will do first, and stop if they say no. Never print `blocklist.private.txt` or any local private file. Work from the repository root.

## 1. End the live service
- Check the Cloudflare login: `cd worker; npm run auth-check`. If it says `NOT_LOGGED_IN`, tell the maintainer a browser tab will open and they should click **Allow**, then run `npx wrangler login` and check again (never ask for a password or token).
- In `worker/wrangler.toml`, set `SERVICE_STATUS = "ended"` under `[vars]`, then `npm run deploy` in `worker/`.
- Verify on the live Worker: POST a well-formed test tip with install id `7e57000000000a01` to `/lesson`, and POST `{"install": "7e57000000000a01"}` to `/delete`. Both must answer **410** with `The Roblox Brain sharing service has ended.` Report the two status codes.
- Explain: from now on, every installed plugin that tries to share gets a 410, turns sharing off for good and tells its user once that the service has ended and the knowledge keeps working.

## 2. Discontinued banners
Add this banner at the very top of `README.md` and `PRIVACY.md` (today's date in YYYY-MM-DD form):

> **Discontinued (YYYY-MM-DD).** The knowledge in the Roblox Brain plugin keeps working offline, but sharing and updates have stopped. The plugin turns sharing off automatically. Previously shared tips have been deleted or will be removed as described below.

Show the maintainer both banners.

## 3. Stored tips
Ask: "Delete all stored tips from the server's database now?" Only if they say yes, run in `worker/`:
- `npx wrangler d1 execute rbrain-inbox --remote --command "DELETE FROM lessons"`
- `npx wrangler d1 execute rbrain-inbox --remote --command "DELETE FROM deletion_requests"`
- then `SELECT COUNT(*) AS n FROM lessons` and report the number (it must be 0).
If they say no, say the daily 90-day cleanup keeps running while the Worker exists, and PRIVACY.md should say when the rest will be removed. Ask them for that wording.
Also offer to delete the local review copies (`inbox/*.jsonl`, `inbox/processed/`, `candidates/*.json`). These are gitignored and private. Delete them only on a yes.

## 4. Final plugin version
Pin a final version so every installed plugin updates one last time and then stays put: add `"version": "<knowledge manifest version>-final"` to `.claude-plugin/plugin.json` and to the plugin entry in `.claude-plugin/marketplace.json`. Add a `knowledge/manifest.json` changelog line: "Final release: sharing service ended."

## 5. Build, test, commit locally
`npm run bundle`, `npm run build`, `npm test`, and in `worker/` `npm test`. If anything fails, stop and report it. Then commit locally (the repo's placeholder git identity is correct) and show the commit id.

## 6. Push
Ask: "Push this to GitHub?" Push only on a yes.

## 7. Archive the repository
Tell the maintainer the exact steps, and do them only if they explicitly ask you to and their browser session is signed in:
1. Open the repository on GitHub and click **Settings**.
2. On the **General** page, scroll to the **Danger Zone** at the bottom.
3. Click **Archive this repository**, type the repository name to confirm, and click the button to archive it.
An archived repository is read-only: the plugin can still be installed from it, and its README and PRIVACY.md show the banner.

Finish with a short report: service status (and the two 410 checks), banners added, whether stored tips were deleted (row count), the final version, the commit id, whether it was pushed, and whether the repository is archived.
