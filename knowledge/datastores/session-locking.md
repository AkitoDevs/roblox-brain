---
title: Session locking player data
topic: datastores/session-locking
scope: generic
source: maintainer-skill
tags: datastore session lock locking duplication dupe server hop rejoin updateasync jobid profilestore player data overwrite
---
# Session locking player data

Without a lock, a player who hops servers can be loaded by the new server before the old one finished saving; the stale copy later overwrites the newer save, and trading turns this into item duplication. A session lock lets only one server own a player's data at a time.

**Shape of a saved key:** `{data = {...}, lock = {job = game.JobId, time = os.time()}}`. `os.time()` is UTC on every server, so lock ages compare fairly. Autosaves refresh the lock time; a lock older than the expiry is treated as abandoned (that server crashed).

	local LOCK_EXPIRY = 10 * 60 -- longer than your autosave interval

	-- Returns the data table, or nil if another live server holds the lock.
	local function acquire(store: DataStore, key: string)
		local lockedByOther = false
		local value = store:UpdateAsync(key, function(old)
			lockedByOther = false -- the transform can run more than once
			old = old or {data = nil, lock = nil}
			local lock = old.lock
			if lock and lock.job ~= game.JobId and os.time() - lock.time < LOCK_EXPIRY then
				lockedByOther = true
				return nil -- cancel: leave the key untouched
			end
			old.lock = {job = game.JobId, time = os.time()}
			return old
		end)
		if lockedByOther then return nil end
		return value.data or {}
	end

	-- Writes only while this server still owns the lock. release = true on leave or teleport.
	local function save(store: DataStore, key: string, userId: number, data, release: boolean)
		store:UpdateAsync(key, function(old)
			if old and old.lock and old.lock.job ~= game.JobId then
				return nil -- lost the lock: never overwrite the other server
			end
			local lock = if release then nil else {job = game.JobId, time = os.time()}
			return {data = data, lock = lock}, {userId}
		end)
	end

Wrap both calls in pcall with retries (datastores/safe-saving).

**Loading flow**
1. On join, call `acquire`. If it returns nil, retry every 5 seconds or so; the old server is usually finishing its leave save.
2. Still locked after about 30 seconds: kick with a "data still saving, please rejoin" message.
3. After the yields, check `player.Parent == Players` before using the data.
4. Migrate and fill defaults, then mark the profile loaded. Until then, ignore purchases and data-changing remotes.
5. On `PlayerRemoving`, and before teleporting to another place, save with `release = true`.

**Notes**
- In Studio, `game.JobId` is empty in every session; locks still work in a single test server.
- If another server took the lock, stop saving that player here and kick them.
- ProfileStore is a widely used open-source module that does this with more edge cases covered. Prefer it in production; never mix it with your own lock on the same keys.
