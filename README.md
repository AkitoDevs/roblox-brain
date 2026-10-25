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

## Day to day

1. **Add knowledge:** write a new `knowledge/<area>/<name>.md` with front matter (`title, topic, scope: generic, source, tags`). Rewrite it in your own words; don't paste from your private skills or from contributors.
2. **Release:** bump `knowledge/manifest.json`, `npm run build`, read the report, tag/push. Users get the update when they update the plugin (or immediately, once you host the server).
3. **Review lessons (weekly):** `npm run triage`, then ask Claude to follow `triage/TRIAGE.md` on `candidates/`. Approve what's good.

## Hosting the shared inbox (next step)

Right now submissions go to the local `inbox/` folder (or wherever `RBRAIN_INBOX` points), which is perfect for testing. For real users you need one small public endpoint:

- A Cloudflare Worker (free tier) with `POST /lesson` that runs the **same** `validateLesson()` (copy `lib/lesson.mjs` + `lib/safety.mjs`), then appends to D1/KV. Reject anything over ~2 KB, add per-install and per-day limits, store no IPs.
- Set `RBRAIN_ENDPOINT` in the plugin's `.mcp.json` env to that URL. Add a `GET /knowledge-version` later if you want live knowledge updates without reinstalling.
- Never trust the client: the server-side validation must run again at the endpoint.

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
