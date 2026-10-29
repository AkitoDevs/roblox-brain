---
title: Setting up remotes and rate limiting them
topic: scripting/remotes-setup
scope: generic
source: maintainer-skill
tags: remoteevent remotefunction unreliableremoteevent networking client server communication fireserver fireclient invokeserver onserverevent rate limit spam throttle cooldown token bucket folder
---
# Setting up remotes and rate limiting them

**Organize them**
- The server creates every remote at startup inside one folder, `ReplicatedStorage.Remotes`. Clients get them with `WaitForChild`. Remotes made by the server can't be missing or duplicated by a client.
- One remote per action, named after it (`BuyItem`, `UseAbility`), instead of one shared remote with an action string.
- Client to server: `RemoteEvent:FireServer(...)`, handled by `OnServerEvent(player, ...)`. The first argument is always the real sender; never accept a player from the payload.
- Server to client: `FireClient(player, ...)` or `FireAllClients(...)`.
- Client asks and needs an answer: `RemoteFunction:InvokeServer`, answered by `OnServerInvoke`. Never use `InvokeClient`; a client that errors or leaves can hang the server thread.
- `UnreliableRemoteEvent` is for frequent cosmetic updates only: messages can be dropped or arrive out of order.
- What survives the trip: functions and metatables are dropped, tables with mixed key types get mangled, Instances the receiver can't see arrive as nil, and numbers can be NaN or infinite.

**A small net module with a token-bucket limiter**

	-- ServerScriptService/Services/Net (ModuleScript)
	local Players = game:GetService("Players")
	local ReplicatedStorage = game:GetService("ReplicatedStorage")

	local folder = Instance.new("Folder")
	folder.Name = "Remotes"
	folder.Parent = ReplicatedStorage

	local Net = {}
	local buckets: {[Player]: {[string]: {tokens: number, last: number}}} = {}

	function Net.event(name: string): RemoteEvent
		local r = Instance.new("RemoteEvent")
		r.Name = name
		r.Parent = folder
		return r
	end

	-- Allows `burst` calls at once, refilling `perSecond` calls each second.
	function Net.allow(player: Player, key: string, perSecond: number, burst: number): boolean
		local now = os.clock()
		local mine = buckets[player]
		if not mine then mine = {}; buckets[player] = mine end
		local b = mine[key]
		if not b then b = {tokens = burst, last = now}; mine[key] = b end
		b.tokens = math.min(burst, b.tokens + (now - b.last) * perSecond)
		b.last = now
		if b.tokens < 1 then return false end
		b.tokens -= 1
		return true
	end

	Players.PlayerRemoving:Connect(function(p) buckets[p] = nil end)
	return Net

**Using it in a handler.** Check in this order: rate limit, argument types, lookup in a server-side table, player state, then let the server compute the result.

	local buy = Net.event("BuyItem")
	buy.OnServerEvent:Connect(function(player, itemId)
		if not Net.allow(player, "BuyItem", 2, 5) then return end
		if typeof(itemId) ~= "string" or #itemId > 40 then return end
		local item = Config.Items[itemId] -- server-side price table
		if not item then return end
		-- check the player's balance and grant on the server here
	end)

- Drop over-limit calls silently. Log repeat offenders and act only after repeated violations, since lag can bunch up honest requests.
- Clients see their own cooldowns for feel, but the server's limiter is the one that counts.
- The full argument checklist is in security/remote-validation.
