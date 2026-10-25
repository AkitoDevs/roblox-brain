# Roblox Brain

A Claude plugin + MCP server that gives anyone's Claude your curated, **generic** Roblox knowledge. After a task it may share one short, automatically filtered tip with the maintainer, who reviews it and may fold the idea into the next release. Sharing is on by default, shown in a notice once per project, and easy to turn off. See [PRIVACY.md](PRIVACY.md).

## How it works

```
 user's Claude ──search_knowledge/get_skill──▶  MCP server  ──reads──▶  knowledge/*.md   (public, generic, versioned)
      │                                            ▲
      │ (sharing on, notice shown in project)      │ pulls new versions on release
      └──────submit_lesson──▶ validation gate ──▶ inbox/   (UNAPPROVED)
                                                     │
                                  npm run triage ────┘  re-validate, dedupe, count independent installs
                                                     ▼
                                              candidates/  ──Claude reviews (triage/TRIAGE.md)──▶ you approve
                                                     ▼
                                    knowledge/ + manifest bump + npm run build ──▶ release
```

- **One repo is the plugin.** `.claude-plugin/` + `skills/` + `.mcp.json` make it installable in Claude Code / Cowork. The same `server/index.mjs` works in any MCP client (claude.ai connectors, Roblox's Studio MCP setups).
- **`skills/roblox-brain/SKILL.md`** tells Claude to consult the knowledge before writing Roblox code, how to show the sharing notice, when a tip may be shared, and the user's sharing commands.
- **Knowledge is an allowlist.** Each entry in `knowledge/` must say `scope: generic`. `npm run build` fails on anything else, on personal-looking data, or on terms in your private blocklist, and prints a publish report of exactly what ships.

## Privacy model

The full, plain-language version for users is [PRIVACY.md](PRIVACY.md).

| Rule | Where enforced |
|---|---|
| Sharing is **on by default**, one global setting the user can turn off ("turn off Roblox Brain sharing") | `server/index.mjs` (`set_sharing`, `~/.roblox-brain/config.json`) |
| A **notice is shown once per project** before anything is shared there; until then `submit_lesson` refuses. Projects are told apart by a salted hash of the folder, kept only locally | `server/index.mjs` |
| No per-tip question; Claude shares at most one tip per task, only when something generalizable was learned, and never nags | server instructions, `SKILL.md`, a 10-minute gap between shares |
| Only `topic, problem, fix, apis, outcome, engine_version` are accepted; unknown fields are dropped | `lib/lesson.mjs` |
| Strict filters, run **before sending** in the plugin and again on the server: no code or code-like text, quotes, file names, paths, links, domains, emails, ids or long numbers, IPs, @handles, "called X" / "my game" mentions, plus your private blocklist | `lib/safety.mjs`, `lib/lesson.mjs` |
| Leak guard in the plugin: a tip containing the project's folder name, the OS user name or the computer's name is dropped | `server/index.mjs` |
| Every shared tip is also written to the user's **sharing history** (`~/.roblox-brain/sent-lessons.md`, notice at the top); "show my shared tips" lists it | `server/index.mjs` |
| "Delete my shared tips" deletes every row for that install id on the server (and, at the next export, the maintainer's local copies), then rotates the install id | `server/index.mjs`, `worker/src/handler.mjs`, `worker/scripts/export-inbox.mjs` |
| Stored record = tip + random install id + **date only** (no IP, timestamps, account) | `server/index.mjs` |
| 20 lessons per install per day | `server/index.mjs`, `worker/src/handler.mjs` |
| 5 lessons per minute per connection on the hosted inbox; the key is a hash of the address, never stored | `worker/src/handler.mjs`, `worker/wrangler.toml` |
| Retention: tips leave the server when exported for review; anything older than 90 days is deleted daily | `worker/scripts/export-inbox.mjs`, Worker cron |
| Shutdown: if the server says the service has ended (HTTP 410), or sharing fails 5+ times across 3+ days, the plugin turns sharing off and tells the user once; the knowledge keeps working offline | `server/index.mjs`, `worker` (`SERVICE_STATUS`) |
| Inbox is **untrusted**; re-validated on triage; nothing auto-merges into `knowledge/` | `tools/triage.mjs`, `triage/TRIAGE.md` |
| Your private stuff never ships: it lives in `blocklist.private.txt` (gitignored) and your private projects are simply never ported | `.gitignore`, `tools/build.mjs` |

## Install (for users)

You need [Claude Code](https://claude.com/claude-code) and Node.js 18 or newer. Nothing else: the MCP server ships as one bundled file (`server/bundle.mjs`), so there is no `npm install`.

The marketplace is named **`roblox-brain`** (from `.claude-plugin/marketplace.json`) and lists one plugin, also named **`roblox-brain`**. In a terminal:

```bash
claude plugin marketplace add AkitoDevs/roblox-brain
claude plugin install roblox-brain@roblox-brain
```

Or inside Claude Code:

```
/plugin marketplace add AkitoDevs/roblox-brain
/plugin install roblox-brain@roblox-brain
```

Restart Claude Code, then ask it to build something for Roblox: it searches the knowledge first. To update later:

```bash
claude plugin marketplace update roblox-brain
claude plugin update roblox-brain@roblox-brain
```

### Get new knowledge automatically

Auto-update is **off by default** for marketplaces like this one (Claude Code only turns it on for Anthropic's official marketplaces). Turn it on once:

1. In Claude Code, run `/plugin` and open the **Marketplaces** tab.
2. Select **roblox-brain**, then select **Enable auto-update**.

From then on, Claude Code checks for a new release in the background after you start a session and updates the plugin on disk. The new knowledge loads the next time you start Claude Code (or right away with `/reload-plugins`). Auto-update stays off if you've set `DISABLE_AUTOUPDATER`, `DISABLE_UPDATES` or `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`.

## License

MIT, see [LICENSE](LICENSE). The knowledge entries in `knowledge/` are part of this repository and are included under the same MIT license.

## Setup (for the maintainer)

```bash
npm install
cp blocklist.private.txt.example blocklist.private.txt   # add your game names, usernames, shop name, etc.
npm run build        # validates knowledge, prints the publish report
npm test             # lib tests, MCP smoke test, bundle up-to-date check, bundle run with no node_modules
```

After changing `server/` or `lib/`, run `npm run bundle` and commit `server/bundle.mjs` (npm test fails if the bundle is stale).

Try it locally with Claude Code: `claude --plugin-dir .` (or add this repo as a plugin marketplace entry), then ask Claude to build something for Roblox.

## Sharing short tips (for users)

Sharing is **on by default**. The first time you use Roblox Brain in a project, Claude shows this notice (with the real paths on your computer):

> Roblox Brain shares short tips to help improve the knowledge for everyone. After a task it may share a brief note with the maintainer about what worked: the topic, the problem, the fix, and any Roblox API names. It's designed to leave out your code, names, ids, links and emails, and filters them automatically. You can see everything it has shared in your sharing history: `<path>`. To stop sharing, say "turn off Roblox Brain sharing". More details: `<PRIVACY.md>`

Nothing is shared in a project before that notice has been shown. After that, a tip may be shared quietly after a task, at most one per task; the first time it happens in a project, Claude adds one line saying so.

Say any of these in Claude Code:
- **"turn off Roblox Brain sharing"**: off for every project on your computer (nothing is shared and no notice is shown).
- **"turn on Roblox Brain sharing"**: back on.
- **"show my shared tips"**: lists your sharing history (`~/.roblox-brain/sent-lessons.md`).
- **"delete my shared tips"**: deletes everything you've shared from the maintainer's copy.

The older phrases ("turn off roblox-brain lesson sharing", "show roblox-brain sent lessons", "delete my roblox-brain lessons") still work. What a tip contains, what it's designed to leave out, how long it's kept and how deleting works are all in [PRIVACY.md](PRIVACY.md).

## Day to day

1. **Add knowledge:** write a new `knowledge/<area>/<name>.md` with front matter (`title, topic, scope: generic, source, tags`). Rewrite it in your own words from the generic parts of your skills (`source: maintainer-skill`); never from personal skills, third-party material or contributors' wording.
2. **Release:** bump `knowledge/manifest.json`, `npm run build`, read the report, tag/push. Users get the update when they update the plugin (or immediately, once you host the server).
3. **Review lessons (weekly):** see below.

## Maintainer commands (in Claude Code, from this folder)

- **`/review-lessons`**: checks your Cloudflare login (opens a browser tab to log in if it expired), exports new lessons, triages them, recommends approve or reject, stops for your choice, drafts the entry and skill changes, applies only what you approve, commits locally and asks before pushing. It ends by telling you whether your skills changed since the last sync.
- **`/sync-skills`**: brings changes from your own Roblox skills into `knowledge/`. It classifies new and changed skills automatically (personal and third-party ones are left out, and when in doubt it leaves things out), keeps only generic lines, rewrites them in your words, runs the blocklist, name and build checks, applies the changes, commits locally and shows one summary. It never pushes without asking. Its state (`triage/sync-map.local.json`, `triage/skill-snapshots/`, `triage/name-scan.local.txt`) is private and gitignored.

Releases reach users through auto-update because the plugin doesn't pin a version: every pushed commit is a new version.

## Weekly lesson review

Tips shared by users go to the hosted inbox, **https://roblox-brain-inbox.rb-inbox-9m2q.workers.dev/lesson** (a Cloudflare Worker + D1; see `worker/README.md`). The plugin's `.mcp.json` points `RBRAIN_ENDPOINT` there. Without that variable, lessons go to the local `inbox/` folder instead (useful for testing).

Once a week (PowerShell, from the repo root):
```
cd worker; npm run export-inbox -- --remote; cd ..   # 1. new lessons from D1 -> inbox/<day>.jsonl, then removed from D1;
                                                     #    also applies delete requests and the 90-day retention
npm run triage                                       # 2. inbox -> candidates/ (re-validated, deduped, install counts)
```
3. Ask Claude: *"Follow triage/TRIAGE.md on candidates/"*. It reviews each lesson and gives you a summary table with the entry and skill each one would change.
4. You mark the good ones `"approved"`. For each, Claude drafts two changes with `npm run draft`: a patch to the shared entry and an edit to your matching skill, shown as diffs. Nothing is applied automatically.
5. You approve the drafts: the entry goes into `knowledge/` (bump `knowledge/manifest.json`, `npm run build`, release), and you save the skill change (through the skill editor for synced skills).

## The two-way loop

```
 your Roblox skills ──(generic parts, rewritten)──▶ knowledge/ ──▶ every user's Claude
        ▲                                                              │
        │                                  short tips (on by default, notice, filtered)
        │                                                              ▼
  skill diff ◀── you approve ◀── triage: related entries + related skills ◀── inbox
        │
        └──▶ entry patch ──▶ knowledge/ (next release)
```

- **Your skills are the source.** The shared knowledge is the generic part of the skills your own Claude works from, rewritten in your words (`source: maintainer-skill`). Personal and third-party skills are never ported.
- **Users get the same base.** Anyone who installs the plugin gets those entries through `search_knowledge`.
- **Tips come back.** With sharing on (the default, after a once-per-project notice), short filtered tips reach the inbox.
- **You approve.** `npm run triage` matches each lesson to the shared entries and to your local skills (listed in the gitignored `triage/skills.local.json`; copy `triage/skills.local.json.example`). Nothing moves without your approval.
- **Both improve.** Each approved lesson gets two drafts: an entry patch for everyone, and a diff to your own skill (or the full new text for skills synced from your account). You apply them; nothing is ever merged automatically.

If export says "no new lessons", there's nothing to do that week.

## Layout

```
.claude-plugin/plugin.json   skills/roblox-brain/SKILL.md   .mcp.json
.claude-plugin/marketplace.json   lets this repo be added as a plugin marketplace
knowledge/                   public generic entries + manifest.json
server/index.mjs             MCP server source (7 tools)
PRIVACY.md                   what is shared, what isn't, history, turning off, deleting, retention, shutdown
server/bundle.mjs            the same server with its dependencies, one file (generated by npm run bundle)
tools/bundle.mjs             builds / checks the bundle
lib/                         knowledge loader+search, lesson validation, safety scan
tools/build.mjs              publish report + validation
tools/triage.mjs             inbox -> candidates (+ related entries and local skills)
tools/draft.mjs              approved candidate -> entry patch + skill diff drafts (never applied)
triage/TRIAGE.md             instructions for your Claude's review job
triage/skills.local.json     your local skills for matching (gitignored; see .example)
schema/lesson.schema.json    the lesson contract
inbox/  candidates/          unapproved + under review (gitignored contents)
tests/                       lib tests + MCP end-to-end smoke test
```
