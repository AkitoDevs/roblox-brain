# Roblox Brain

A Claude plugin + MCP server that gives anyone's Claude your curated, **generic** Roblox knowledge, and lets users optionally send back short anonymous lessons that you review and fold into the next release.

## How it works

```
 user's Claude ──search_knowledge/get_skill──▶  MCP server  ──reads──▶  knowledge/*.md   (public, generic, versioned)
      │                                            ▲
      │ (only if sharing ON, and user said yes)    │ pulls new versions on release
      └──────submit_lesson──▶ validation gate ──▶ inbox/   (UNAPPROVED)
                                                     │
                                  npm run triage ────┘  re-validate, dedupe, count independent installs
                                                     ▼
                                              candidates/  ──Claude reviews (triage/TRIAGE.md)──▶ you approve
                                                     ▼
                                    knowledge/ + manifest bump + npm run build ──▶ release
```

- **One repo is the plugin.** `.claude-plugin/` + `skills/` + `.mcp.json` make it installable in Claude Code / Cowork. The same `server/index.mjs` works in any MCP client (claude.ai connectors, Roblox's Studio MCP setups).
- **`skills/roblox-brain/SKILL.md`** tells Claude to consult the knowledge before writing Roblox code, and describes the consent flow for lessons.
- **Knowledge is an allowlist.** Each entry in `knowledge/` must say `scope: generic`. `npm run build` fails on anything else, on personal-looking data, or on terms in your private blocklist, and prints a publish report of exactly what ships.

## Privacy model (what makes it non-invasive)

| Rule | Where enforced |
|---|---|
| Sharing is **OFF by default**; only the user turns it on | `server/index.mjs` (`set_sharing`, config in `~/.roblox-brain/config.json`) |
| Claude must **show the lesson and get a yes** (`user_approved: true`) | tool schema + `SKILL.md` |
| Only `topic, problem, fix, apis, outcome, engine_version` are accepted; unknown fields are dropped | `lib/lesson.mjs` |
| Max 300/400 chars, **no code fences, links, emails, paths, ids, @handles, token-like strings**, plus your private blocklist | `lib/lesson.mjs`, `lib/safety.mjs` |
| Stored record = lesson + random install id + **date only** (no IP, timestamps, account) | `server/index.mjs` |
| 20 lessons per install per day | `server/index.mjs` |
| Inbox is **untrusted**; re-validated on triage; nothing auto-merges into `knowledge/` | `tools/triage.mjs`, `triage/TRIAGE.md` |
| Your private stuff never ships: it lives in `blocklist.private.txt` (gitignored) and your private projects are simply never ported | `.gitignore`, `tools/build.mjs` |

## Setup

```bash
npm install
cp blocklist.private.txt.example blocklist.private.txt   # add your game names, usernames, shop name, etc.
npm run build        # validates knowledge, prints the publish report
npm test             # lib tests + end-to-end MCP smoke test
```

Try it locally with Claude Code: `claude --plugin-dir .` (or add this repo as a plugin marketplace entry), then ask Claude to build something for Roblox.

## Turn on lesson sharing (for users)

Lesson sharing is **OFF by default**. While it's off, nothing is ever sent anywhere; the plugin only reads its built-in knowledge.

- **Turn it on:** tell Claude *"turn on roblox-brain lesson sharing"*. After that, when something generally useful comes up, Claude shows you the exact short lesson (topic, problem, fix, API names) and sends it **only if you say yes**.
- **Turn it off:** tell Claude *"turn off roblox-brain lesson sharing"*. It stays off until you turn it on again.
- **Check it:** ask *"is roblox-brain lesson sharing on?"*

The setting is stored only on your computer, in `~/.roblox-brain/config.json` (`"share": true/false`), next to a random install id that isn't linked to any account. Lessons never contain code, game or user names, ids, links or emails; the plugin and the server both reject them.

## Day to day

1. **Add knowledge:** write a new `knowledge/<area>/<name>.md` with front matter (`title, topic, scope: generic, source, tags`). Rewrite it in your own words; don't paste from your private skills or from contributors.
2. **Release:** bump `knowledge/manifest.json`, `npm run build`, read the report, tag/push. Users get the update when they update the plugin (or immediately, once you host the server).
3. **Review lessons (weekly):** see below.

## Weekly lesson review

Approved lessons from users go to the hosted inbox, **https://roblox-brain-inbox.rb-inbox-9m2q.workers.dev/lesson** (a Cloudflare Worker + D1; see `worker/README.md`). The plugin's `.mcp.json` points `RBRAIN_ENDPOINT` there. Without that variable, lessons go to the local `inbox/` folder instead (useful for testing).

Once a week (PowerShell, from the repo root):
```
cd worker; npm run export-inbox -- --remote; cd ..   # 1. new lessons from D1 -> inbox/<day>.jsonl (marks them exported)
npm run triage                                       # 2. inbox -> candidates/ (re-validated, deduped, install counts)
```
3. Ask Claude: *"Follow triage/TRIAGE.md on candidates/"*. It proposes drafts in `candidates/drafts/` and a summary table; it never edits `knowledge/` itself.
4. You approve: move good drafts into `knowledge/`, bump `knowledge/manifest.json`, run `npm run build`, release.

If export says "no new lessons", there's nothing to do that week.

## Layout

```
.claude-plugin/plugin.json   skills/roblox-brain/SKILL.md   .mcp.json
knowledge/                   public generic entries + manifest.json
server/index.mjs             MCP server (5 tools)
lib/                         knowledge loader+search, lesson validation, safety scan
tools/build.mjs              publish report + validation
tools/triage.mjs             inbox -> candidates
triage/TRIAGE.md             instructions for your Claude's review job
schema/lesson.schema.json    the lesson contract
inbox/  candidates/          unapproved + under review (gitignored contents)
tests/                       lib tests + MCP end-to-end smoke test
```
