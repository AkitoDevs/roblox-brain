---
title: Pathfinding and NPC movement
topic: scripting/pathfinding-npc
scope: generic
source: maintainer-skill
tags: pathfinding pathfindingservice npc enemy ai move walk follow chase patrol navigation humanoid moveto movetofinished path waypoint computeasync blocked jump networkowner
---
# Pathfinding and NPC movement

For an NPC with a Humanoid: compute a path with PathfindingService, walk it one waypoint at a time with `Humanoid:MoveTo`, and recompute when it gets blocked. Run it on the server.

	local PathfindingService = game:GetService("PathfindingService")

	local path = PathfindingService:CreatePath({
		AgentRadius = 2,     -- half the NPC's width (default 2)
		AgentHeight = 5,     -- default 5
		AgentCanJump = true,
		Costs = {Water = 20, Danger = math.huge}, -- material names or modifier labels
	})

	-- Walks npc to goal. Returns true if it arrived.
	local function walkTo(npc: Model, goal: Vector3): boolean
		local humanoid = npc:FindFirstChildOfClass("Humanoid")
		local root = npc:FindFirstChild("HumanoidRootPart") :: BasePart?
		if not humanoid or not root then return false end

		local ok = pcall(function() path:ComputeAsync(root.Position, goal) end)
		if not ok or path.Status ~= Enum.PathStatus.Success then return false end

		local waypoints = path:GetWaypoints()
		local current = 2 -- waypoint 1 is the start position
		local blocked = false
		local conn = path.Blocked:Connect(function(index)
			if index >= current then blocked = true end -- only obstacles ahead matter
		end)

		local arrived = true
		for i = 2, #waypoints do
			current = i
			local wp = waypoints[i]
			if wp.Action == Enum.PathWaypointAction.Jump then humanoid.Jump = true end
			humanoid:MoveTo(wp.Position)
			local reached = humanoid.MoveToFinished:Wait()
			if blocked or not reached or humanoid.Health <= 0 then
				arrived = false
				break
			end
		end
		conn:Disconnect()
		return arrived
	end

One path object can be reused per NPC; create it once, not every call.

**Facts that cause most bugs**
- `MoveTo` gives up after 8 seconds and `MoveToFinished` then passes false. Walking one waypoint at a time keeps each move short; for a single long `MoveTo`, call it again every few seconds.
- `ComputeAsync` yields and can error; always pcall it. `NoPath` means the goal is unreachable for that agent size, often because `AgentRadius` is too big for a doorway.
- Set the NPC's root to server ownership once it's in the world: `root:SetNetworkOwner(nil)`. Otherwise physics ownership swaps to nearby players and the NPC stutters (and exploiters could move it).
- Mark areas with a `PathfindingModifier` (its Label goes in `Costs`; `math.huge` makes it impassable) and connect gaps with `PathfindingLink`.

**Chasing a moving target**
- Recompute about every 0.5 seconds, and only if the target moved more than a few studs; never every frame.
- When the target is close with clear line of sight (one `workspace:Raycast`), skip pathfinding and `MoveTo` it directly. Check distance first, then a field-of-view dot product, then the raycast.

**Behaviour structure.** A small state machine per NPC (idle, patrol, chase, attack, dead), each state cleaning up its own connections. Stagger updates so enemies don't all think on the same frame, and pause NPCs far from every player.
