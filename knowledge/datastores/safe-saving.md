---
title: Safe player data saving
topic: datastores/safe-saving
scope: generic
source: own-testing
tags: datastore save load player data retry backoff updateasync bindtoclose autosave schema version migration defaults reconcile data loss
---
# Safe player data saving

Most data loss comes from saving bad data over good data, or from losing the last save. All DataStore calls run on the server only.

**Retry with backoff.** Every call can fail or throttle, so wrap it in pcall and retry a few times:

	local DataStoreService = game:GetService("DataStoreService")
	local Players = game:GetService("Players")
	local store = DataStoreService:GetDataStore("PlayerData")

	local function retry(fn: () -> any): (boolean, any)
		local delay = 1
		for attempt = 1, 4 do
			local ok, result = pcall(fn)
			if ok then return true, result end
			warn("DataStore attempt", attempt, "failed:", result)
			if attempt < 4 then task.wait(delay); delay *= 2 end
		end
		return false, nil
	end

**Never play on defaults after a failed load.** If loading fails, kick the player with a short message (or flag the session as never-save). Otherwise the empty default data gets saved over their real data.

**Schema version and defaults.** Store a `version` field. On load, migrate old shapes step by step, then fill any missing keys from a template so new fields work for old saves:

	local TEMPLATE = {version = 2, coins = 0, inventory = {}}

	local function migrate(data)
		if data.version == 1 then -- version 1 called coins "cash"
			data.coins = data.cash; data.cash = nil; data.version = 2
		end
		for k, v in TEMPLATE do
			if data[k] == nil then data[k] = if type(v) == "table" then table.clone(v) else v end
		end
		return data
	end

**Write with UpdateAsync, not SetAsync,** when more than one server might touch a key. The transform function must be quick, must not yield and can run more than once, so keep it pure. Returning nil from it cancels the write. Its second return value can list the player's UserId, which ties the key to them for data-deletion requests.

**When to save.** Autosave every few minutes, on `PlayerRemoving`, and in `game:BindToClose`. Do not save on every coin change; that burns the request budget and throttles you. BindToClose gets about 30 seconds, so save everyone in parallel and wait on a counter, not a fixed wait:

	game:BindToClose(function()
		local pending = 0
		for _, player in Players:GetPlayers() do
			pending += 1
			task.spawn(function()
				saveProfile(player) -- your UpdateAsync save, wrapped in retry
				pending -= 1
			end)
		end
		while pending > 0 do task.wait() end
	end)

**Stored values.** Plain data only: numbers, strings, booleans and tables with string keys or contiguous arrays. No Instances, Vector3s or Color3s; save their numbers.

**Studio.** With API access on, Studio reads and writes the live data of that experience. Use a differently named store while testing.

Two servers can still load the same player during a quick server hop; prevent that with a session lock (datastores/session-locking).
