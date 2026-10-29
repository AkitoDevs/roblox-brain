---
title: Module structure for client, server and shared code, and bootstrapping
topic: scripting/project-structure
scope: generic
source: maintainer-skill
tags: module modulescript script structure client server shared organize architecture folders bootstrap require init start serverscriptservice replicatedstorage starterplayerscripts localscript framework
---
# Module structure and bootstrapping

Put nearly all code in ModuleScripts, with exactly one Script on the server and one LocalScript on the client that load them. One entry point per side gives a predictable start order instead of many scripts racing each other.

**Where code goes**
- **ServerScriptService:** the server bootstrap Script and server modules. Never replicated to clients.
- **ServerStorage:** server-only modules and templates (maps, NPCs, tools) the client must not see.
- **ReplicatedStorage:** shared modules (config tables, types, pure helpers) and the Remotes folder. Both sides can require these.
- **StarterPlayer > StarterPlayerScripts:** the client bootstrap LocalScript and client modules.

Everything in ReplicatedStorage, Workspace and client folders can be read (and decompiled) by exploiters, so never put admin lists, hidden drop tables or server rules there.

**Service pattern.** Each module returns a table with an optional `init` (set up state; no yielding, no calls into other services) and `start` (connect events, start loops). The bootstrap requires all, runs every `init`, then every `start`:

	-- ServerScriptService/Main (Script)
	local ServerScriptService = game:GetService("ServerScriptService")
	local services = {}
	for _, m in ServerScriptService.Services:GetChildren() do
		if m:IsA("ModuleScript") then
			services[m.Name] = require(m)
		end
	end
	for _, s in services do
		if s.init then s.init(services) end
	end
	for _, s in services do
		if s.start then task.spawn(s.start) end -- one slow start can't block the rest
	end

	-- ServerScriptService/Services/Coins (ModuleScript)
	local Players = game:GetService("Players")
	local Coins = {}
	local balances: {[Player]: number} = {}
	function Coins.start()
		Players.PlayerRemoving:Connect(function(p) balances[p] = nil end)
	end
	function Coins.add(player: Player, n: number)
		balances[player] = (balances[player] or 0) + n
	end
	return Coins

The client mirrors this: one LocalScript in StarterPlayerScripts requiring a Controllers folder the same way.

**Rules that prevent most structure bugs**
- A module runs once per side and is cached: every `require` of it on the server returns the same table. The client has its own separate copy; the two sides only talk through remotes, attributes and replicated instances.
- Avoid circular requires (A requires B, B requires A); they fail. Pass the `services` table into `init` instead and look siblings up there.
- On the client, use `WaitForChild` for anything the server creates at runtime (remotes, leaderstats, spawned models).
- Keep tunable numbers (prices, cooldowns, product ids) in one shared Config module of plain tables, frozen with `table.freeze` so nothing edits them by accident. Values clients must not know live in a server-only module.
- Add `--!strict` to new modules (see scripting/luau-strict-typing).
- A module that errors while loading errors every `require` of it; read the first error in the Output, not the later ones.
