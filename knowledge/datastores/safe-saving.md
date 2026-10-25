---
title: Safe player data saving
topic: datastores/safe-saving
scope: generic
source: own-testing
tags: datastore save load retry updateasync bindtoclose profile data loss
---
# Safe player data saving

Most data-loss bugs come from saving bad data over good data, or from losing the final save.

- Wrap every DataStore call in pcall and retry failures with exponential backoff; give up after a few attempts and keep the data in memory.
- If loading fails, do not let the player play with fresh default data that will then be saved over their real data. Kick them with a message, or mark the session as unsaved.
- Prefer UpdateAsync over SetAsync when other servers could touch the same key, and make the update function pure and quick.
- Autosave on a timer (every few minutes), on PlayerRemoving, and in game:BindToClose so shutdowns still save. In BindToClose, save all players in parallel and wait for them.
- Respect request budgets. Saving on every small change will throttle you; batch changes and save on a schedule.
- Store a schema version number in the data and migrate old shapes on load instead of assuming the current shape.
- Keep stored values small and plain (numbers, strings, tables of those). Do not store Instances or functions.
- Test failure paths in Studio by simulating errors, not only the happy path.
