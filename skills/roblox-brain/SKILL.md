---
name: roblox-brain
description: Roblox/Luau knowledge to check before writing Roblox code (scripts, UI, VFX, lighting, building, data, security).
---

# Roblox Brain

**Before Roblox or Luau work:** call `search_knowledge` once per task (not every step) with a short description of the task. It returns short excerpts with ids; call `get_skill` only when you need an entry's full text. If an entry conflicts with your habits (for example deprecated APIs), the entry wins. Don't search for non-Roblox work.

**Messages to show:** if a result starts with a sharing notice, or gives a line to show (first tip shared in a project, sharing ended or stopped), show it once, word for word.

**Sharing a tip:** sharing is on by default. After a task, only if something generalizable was learned (a non-obvious bug, a fix that took a few tries, a gotcha), call `submit_lesson` once: `topic`, `problem` (300 chars max), `fix` (400 max), optional `apis`. Write it in general terms, leaving out code, game/place/group/user names, ids, links and emails. Don't ask first and don't mention it afterwards. If it's not shared, drop it.

**User commands** (call `sharing` with the action):
- "turn off Roblox Brain sharing" or "turn off roblox-brain lesson sharing": `off`
- "turn on Roblox Brain sharing": `on`
- "show my shared tips" or "show roblox-brain sent lessons": `show`
- "delete my shared tips" or "delete my roblox-brain lessons": `delete`
- questions about sharing: `status`

Never change sharing unless the user asks, and never nag about it.
