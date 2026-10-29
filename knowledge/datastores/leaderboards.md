---
title: Leaderboards with leaderstats and OrderedDataStore
topic: datastores/leaderboards
scope: generic
source: maintainer-skill
tags: leaderboard leaderstats global top ranking ordereddatastore datastore getsortedasync intvalue playerlist highscore wins kills coins
---
# Leaderboards: leaderstats and global top lists

There are two different things people call a leaderboard:
- **The in-server player list** (top-right corner): a Folder named exactly `leaderstats` under each Player, holding IntValue, NumberValue or StringValue children.
- **A global all-time board** (usually a SurfaceGui on a wall): an OrderedDataStore read with `GetSortedAsync`.

**leaderstats**

	local Players = game:GetService("Players")

	Players.PlayerAdded:Connect(function(player)
		local stats = Instance.new("Folder")
		stats.Name = "leaderstats" -- exact, lowercase
		local coins = Instance.new("IntValue")
		coins.Name = "Coins"
		coins.Value = 0 -- set from loaded save data
		coins.Parent = stats
		stats.Parent = player
	end)

Treat leaderstats as a display. The real balance lives in the server's data table, which is what you save; update the IntValue whenever that changes. Create it on the server only, since client-made values aren't seen by anyone else.

**Global board with OrderedDataStore.** It stores one whole number per key and can return keys sorted by value. Use the UserId as the key, never the name (names change).

	local DataStoreService = game:GetService("DataStoreService")
	local topCoins = DataStoreService:GetOrderedDataStore("TopCoins")

	-- Call when you save the player, not on every change.
	local function submit(player: Player, coins: number)
		pcall(function()
			topCoins:SetAsync(tostring(player.UserId), math.floor(coins))
		end)
	end

	local nameCache: {[number]: string} = {}
	local function refresh(): {{name: string, value: number}}?
		local ok, pages = pcall(function()
			return topCoins:GetSortedAsync(false, 10) -- false = highest first
		end)
		if not ok then return nil end
		local rows = {}
		for _, entry in pages:GetCurrentPage() do
			local userId = tonumber(entry.key) :: number
			if not nameCache[userId] then
				local okName, name = pcall(Players.GetNameFromUserIdAsync, Players, userId)
				nameCache[userId] = if okName then name else "Unknown"
			end
			table.insert(rows, {name = nameCache[userId], value = entry.value})
		end
		return rows
	end

**Showing it.** Refresh on the server every 60 seconds or more (sorted reads have their own budget), then write the rows into a SurfaceGui on a part in Workspace; text set by the server replicates to everyone. Keep the last good rows when a refresh fails instead of blanking the board.

**Tips**
- For time-based boards (weekly wins), put the period in the store name, for example `"Wins_"` followed by the week number, so each week starts empty.
- Values must be whole numbers. For huge numbers that grow past what fits comfortably, store a rounded or logarithmic value and display the real one from the player's own data.
- `GetSortedAsync` also takes optional minimum and maximum values to show a range.
- Format big numbers for display (1.2K, 3.4M); see the UI entries for readable number styles.
