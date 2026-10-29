---
title: Memory leaks from connections, tables and threads
topic: scripting/memory-leaks
scope: generic
source: maintainer-skill
tags: memory leak leaks connection connections disconnect cleanup destroy janitor trove maid garbage lua heap luaheap developer console growing lag over time playerremoving
---
# Memory leaks: connections, tables and threads

A server that gets slower the longer it runs almost always holds on to things it no longer needs. Luau frees memory only when nothing refers to it, and these references are the usual culprits.

**1. Connections on long-lived signals.** A connection keeps its function and everything that function captures alive until it is disconnected. Connections on an Instance are cleaned up when that Instance is `:Destroy()`ed, but not when it is only parented to nil. The leak pattern is per-round or per-player code connecting to something that lives forever (`RunService.Heartbeat`, `Players.PlayerAdded`, a part in the map, an attribute signal on ReplicatedStorage) and never disconnecting. Each round adds another copy.

**2. Tables keyed by players or objects.** `cooldowns[player] = ...` stays forever unless you clear it on `PlayerRemoving`. Same for caches keyed by models that get destroyed.

**3. Threads that never finish.** A `while true do` loop or a `:Wait()` on an event that will never fire (an NPC destroyed mid-walk) keeps its whole stack alive. Give loops an exit condition and cancel threads you own with `task.cancel`.

**4. Old characters and players.** When `Workspace.PlayerCharacterDestroyBehavior` is not enabled, characters from previous lives and Player objects of people who left are parented to nil rather than destroyed, so connections on them stay alive. Enable that property, or destroy them yourself after `CharacterRemoving` and `PlayerRemoving`.

**A small cleanup helper.** Collect everything a round, NPC or UI screen creates, then clean it in one call:

	local function newCleanup()
		local items = {}
		local self = {}
		function self.add<T>(x: T): T
			table.insert(items, x)
			return x
		end
		function self.clean()
			for i = #items, 1, -1 do
				local x = items[i]
				if typeof(x) == "RBXScriptConnection" then x:Disconnect()
				elseif typeof(x) == "Instance" then x:Destroy()
				elseif type(x) == "thread" then pcall(task.cancel, x)
				elseif type(x) == "function" then x() end
			end
			table.clear(items)
		end
		return self
	end

	-- per round
	local round = newCleanup()
	round.add(RunService.Heartbeat:Connect(updateTimer))
	round.add(task.spawn(spawnPickupsLoop))
	round.add(mapTemplate:Clone()).Parent = workspace
	-- round over:
	round.clean()

Open-source helpers (Trove, Janitor, Maid) do the same with more features. Use `:Once()` for one-shot listeners; it disconnects itself.

**Finding a leak**
- Developer Console (F9) > Memory: watch `LuaHeap` and the instance count across several rounds or rejoins. A healthy game goes up and down; a leak only goes up.
- Count suspects directly: print `#workspace:GetDescendants()` or the size of your player tables each round.
- In Studio, the Luau Heap tool in the Developer Console takes snapshots you can compare to see which tables grew.
- Test by playing several full rounds with a second test player joining and leaving, not just one short session.
