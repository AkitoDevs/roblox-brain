---
title: Teleporting between places
topic: scripting/teleporting-places
scope: generic
source: maintainer-skill
tags: teleport teleportservice teleportasync teleportoptions place places universe lobby match reserved server private party teleport data teleportinitfailed setteleportgui getjoindata
---
# Teleporting between places

An experience can have several places (a lobby and match places). Move players between them with `TeleportService:TeleportAsync`. To move a player within the same place, don't teleport; use `character:PivotTo(cframe)`.

**Facts first**
- `TeleportAsync` runs on the server only. A client that wants to go somewhere fires a remote, and the server decides.
- It does not work in Studio playtests; test teleports in a published game.
- Players teleported in one call travel together, so pass the whole party in one list.
- It can fail (place busy, network trouble). Wrap it in pcall, retry a few times, and handle `TeleportInitFailed`.

**A reusable teleport function**

	local TeleportService = game:GetService("TeleportService")

	local function teleport(players: {Player}, placeId: number, data: {[string]: any}?, private: boolean?)
		local options = Instance.new("TeleportOptions")
		if private then options.ShouldReserveServer = true end -- a fresh server just for this group
		if data then options:SetTeleportData(data) end
		for attempt = 1, 3 do
			local ok, err = pcall(function()
				TeleportService:TeleportAsync(placeId, players, options)
			end)
			if ok then return true end
			warn("Teleport attempt", attempt, "failed:", err)
			task.wait(2 * attempt)
		end
		return false
	end

	-- the request went out but this player could not leave; retry a limited number of times
	local retries: {[Player]: number} = {}
	TeleportService.TeleportInitFailed:Connect(function(player, result, message, placeId, options)
		local n = (retries[player] or 0) + 1
		retries[player] = n
		if n > 3 then return end
		task.wait(2)
		pcall(function() TeleportService:TeleportAsync(placeId, {player}, options) end)
	end)

**Saving before you leave.** Save each player's data before calling teleport, and release a session lock if you use one (datastores/session-locking). Otherwise the destination server can load older data or find the lock still held.

**Teleport data**
- `SetTeleportData` carries small, harmless info (chosen map, party id).
- It passes through the client and can be forged. Never put currency, items or permissions in it; the destination server loads those from DataStores.
- Read it on the destination server with `player:GetJoinData().TeleportData`, and on the client with `TeleportService:GetLocalPlayerTeleportData()`. Validate it like remote input.

**Matchmaking pattern**
1. Players gather in the lobby (a queue pad or a menu).
2. When enough are queued, the lobby server teleports the group with `private = true` so they share a fresh match server.
3. The match place runs its round, saves results, then teleports everyone back to the lobby place.

**Polish**
- A LocalScript can call `TeleportService:SetTeleportGui(screenGui)` so the player sees your loading screen during the trip, and the destination can show the same screen from ReplicatedFirst.
- Tell the player when a teleport fails instead of leaving them on a frozen pad.
- `ReserveServerAsync` is deprecated; use TeleportOptions instead.
