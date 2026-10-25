---
name: roblox-brain
description: Use whenever the user is building, fixing or reviewing anything for Roblox (Luau scripts, UI, remotes, DataStores, Studio workflows). Loads curated Roblox knowledge before writing code, and offers opt-in anonymous lesson sharing afterwards.
---

# Roblox Brain

## Before you write Roblox code
1. Call the `search_knowledge` tool (roblox-brain MCP server) with a short description of the task. If an entry looks relevant, call `get_skill` for the full text.
2. Follow what it says. If your own habit conflicts with an entry (for example deprecated APIs), the entry wins.
3. If nothing matches, carry on normally and verify unfamiliar APIs against the current Roblox documentation.

## After a task: lesson sharing (opt-in)
Only consider this when something **generalizable** was learned (a non-obvious bug, a fix that took iteration, a gotcha), never for routine work.

1. Call `sharing_status`. If sharing is OFF, do not submit anything. You may mention once per conversation, in one sentence, that the user can turn sharing on if they want to help improve the shared knowledge. Never turn it on yourself.
2. If sharing is ON, write the lesson in general terms: `topic`, `problem` (max 300 chars), `fix` (max 400 chars), optional `apis`, `outcome`.
3. **Show the user the exact lesson text and ask if it's OK to send.** Only after a clear yes, call `submit_lesson` with `user_approved: true`.
4. The lesson must contain NO code, NO game/place/group/user names, NO ids, NO links, and nothing personal. If you cannot describe it without those, do not submit.

## Never
- Never send transcripts, file contents, project names or anything identifying.
- Never call `set_sharing` unless the user explicitly asked.
