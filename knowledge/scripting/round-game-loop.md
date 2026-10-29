---
title: Round systems and the game loop
topic: scripting/round-game-loop
scope: generic
source: maintainer-skill
tags: round rounds round system game loop intermission timer countdown match state machine minigame lobby arena last standing winner respawn loadcharacter map reset
---
# Round systems and the game loop

One server Script owns the loop. It moves through states (Waiting, Intermission, Playing, Ended), publishes the state as attributes, and every client draws UI from those attributes. Clients never decide when a round starts or who won.

**Server loop**

	-- ServerScriptService/Rounds (Script)
	local Players = game:GetService("Players")
	local ReplicatedStorage = game:GetService("ReplicatedStorage")
	local ServerStorage = game:GetService("ServerStorage")

	local MIN_PLAYERS, INTERMISSION, ROUND_TIME = 2, 15, 120

	local function setState(name: string, seconds: number)
		ReplicatedStorage:SetAttribute("RoundState", name)
		ReplicatedStorage:SetAttribute("EndsAt", workspace:GetServerTimeNow() + seconds)
	end

	local function runRound()
		local map = ServerStorage.Maps.Arena:Clone() -- fresh copy each round resets the map
		map.Parent = workspace
		local alive: {[Player]: boolean} = {}
		local conns = {}
		for _, p in Players:GetPlayers() do
			local hum = p.Character and p.Character:FindFirstChildOfClass("Humanoid")
			if hum and hum.Health > 0 then
				alive[p] = true
				p.Character:PivotTo(map.Spawn.CFrame + Vector3.new(0, 3, 0))
				table.insert(conns, hum.Died:Connect(function() alive[p] = nil end))
			end
		end
		table.insert(conns, Players.PlayerRemoving:Connect(function(p) alive[p] = nil end))

		setState("Playing", ROUND_TIME)
		local endsAt = os.clock() + ROUND_TIME
		local function count() local n = 0; for _ in alive do n += 1 end; return n end
		while os.clock() < endsAt and count() > 1 do task.wait(0.5) end

		setState("Ended", 5)
		for p in alive do
			-- award the survivors through your data module here
		end
		for _, c in conns do c:Disconnect() end
		task.wait(5)
		map:Destroy()
		for _, p in Players:GetPlayers() do p:LoadCharacter() end -- everyone back to the lobby
	end

	while true do
		setState("Waiting", 0)
		while #Players:GetPlayers() < MIN_PLAYERS do task.wait(1) end
		setState("Intermission", INTERMISSION)
		task.wait(INTERMISSION)
		local ok, err = pcall(runRound)
		if not ok then warn("Round failed:", err) end -- one bug must not end the loop forever
	end

**Client timer.** An end time replicates once per state and every client counts down by itself:

	local RunService = game:GetService("RunService")
	RunService.Heartbeat:Connect(function()
		local endsAt = ReplicatedStorage:GetAttribute("EndsAt") or 0
		local left = math.max(0, math.ceil(endsAt - workspace:GetServerTimeNow()))
		label.Text = `{ReplicatedStorage:GetAttribute("RoundState")}  {left}`
	end)

`workspace:GetServerTimeNow()` is the same clock on server and clients.

**Rules**
- Decide what late joiners do (spectate or wait in the lobby).
- Disconnect every round connection and destroy the map even when the round errors; a cleanup helper makes this one call (scripting/memory-leaks).
- `PivotTo` moves the whole character; setting one part's position breaks the rig.
- For several arenas at once, make the round a function that takes its map and player list, and run one per arena with `task.spawn`.
