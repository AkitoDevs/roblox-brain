---
description: Bring changes from the maintainer's own Roblox skills into the shared knowledge - automatic classification and scans, applied and committed locally, never pushed without asking
---

# /sync-skills

Bring the maintainer's skill updates into `knowledge/`. Classification, filtering and scans are automatic and conservative: **when in doubt, leave it out**. Work from the repository root. Rules for the whole run:

- **Never print, quote, copy or log `blocklist.private.txt`, `triage/sync-map.local.json`, `triage/name-scan.local.txt` or anything in `triage/skill-snapshots/`.** The tool reads them itself. Refer to skills by name only.
- **Don't ask the maintainer to classify anything.** The tool classifies every new or changed skill:
  - **Personal** (excluded): private terms, the maintainer's games, shop, accounts, local paths, private notes or plans, or a skill outside their own skills folders.
  - **Third-party** (excluded, reference only): from an installed plugin or marketplace, another author or licence, attribution or links to someone else's material, or "learned from" / "adapted from" a specific other creator's work.
  - **Shareable** (used): the maintainer's own, with none of those signals.
  - **Mixed** (only the clean lines are used) or **unsure** (left out entirely).
- **Never copy anyone's wording**: write entries in the maintainer's own plain words. **No names of other games, creators, studios, brands or sites.** Never use content from a skipped skill or a dropped line.
- Apply and commit locally on your own. **Never push.** At the end, ask before pushing.

## Step 1: what changed
Run `npm run sync -- status`. If it reports 0 changed, 0 not synced and 0 new, say "Your skills haven't changed since the last sync" in one line and stop.

## Step 2: prepare (automatic classification)
Run `npm run sync -- prepare`. It:
- classifies new Roblox skills automatically and records the result in the private map;
- for changed skills, keeps only the lines added since the last sync, and drops any line with a personal or borrowed signal;
- writes the usable lines to `candidates/drafts/sync-<date>/usable/<skill>.txt` and copies the affected entries to `candidates/drafts/sync-<date>/knowledge/`.

## Step 3: draft the entry changes
For each skill marked USE, read only its `usable/<skill>.txt`. Update the copied entries under the draft's `knowledge/` folder, or add new ones as `knowledge/<area>/<name>.md` with front matter (`title`, `topic`, `scope: generic`, `source: maintainer-skill`, `tags`). Keep the concrete rules, numbers and gotchas, about 150-350 words per entry (split if it grows). If nothing in a skill's usable lines is generic and worth sharing, leave its entries unchanged.

## Step 4: scans and checks (automatic)
1. `npm run sync -- check <draftDir> --fix`: runs the private blocklist, the name and link scan and the build rules on every proposed entry, removes any new line that trips them (recording what was removed), and writes entry diffs.
2. If it still fails (for example missing front matter), fix the entry and run the check again. If an entry can't be fixed cleanly, restore it to the live text so it's left unchanged.

## Step 5: apply and commit locally
If `prepare` listed no USE skills, or no entry changed in step 4, skip straight to `npm run sync -- finish <draftDir>` and the summary: no manifest bump and no commit.

1. `npm run sync -- apply <draftDir>`.
2. Bump `knowledge/manifest.json` (patch version, with a changelog line naming the entries changed; no skill text).
3. `npm run build` and `npm test`. If either fails, restore the changed entries with `git checkout -- knowledge`, report the failure, and stop without committing.
4. `npm run sync -- finish <draftDir>`: marks the processed skills synced and prints the summary.
5. Commit locally (only `knowledge/`, nothing private), keeping the repo's placeholder git identity.

## Step 6: one summary, then ask
Show the maintainer the summary from `finish`, in plain words: entries updated, new entries, skills skipped with the one-line reason for each, and what the scans removed. Add the commit id, then ask: "Push this to GitHub?" Don't push unless they say yes.
