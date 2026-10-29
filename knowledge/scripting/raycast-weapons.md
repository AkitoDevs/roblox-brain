---
title: Raycast guns and hitscan weapons
topic: scripting/raycast-weapons
scope: generic
source: maintainer-skill
tags: raycast raycasting gun guns shoot shooting hitscan bullet blaster rifle pistol weapon aim mouse raycastparams workspace raycast damage tracer fire rate ammo
---
# Raycast guns and hitscan weapons

The client picks where the player aimed and shows the shot at once; the server re-casts the ray from the shooter's real position and decides the hit. Never let the client say who it hit or the damage.

**Client (LocalScript inside the Tool)**

	local UserInputService = game:GetService("UserInputService")
	local tool = script.Parent
	local fire = game.ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("Fire") :: RemoteEvent

	local params = RaycastParams.new()
	params.FilterType = Enum.RaycastFilterType.Exclude

	tool.Activated:Connect(function()
		local camera = workspace.CurrentCamera
		local mouse = UserInputService:GetMouseLocation()
		local ray = camera:ViewportPointToRay(mouse.X, mouse.Y)
		params.FilterDescendantsInstances = {tool.Parent}
		local result = workspace:Raycast(ray.Origin, ray.Direction * 500, params)
		fire:FireServer(if result then result.Position else ray.Origin + ray.Direction * 500)
		-- muzzle flash, sound and a local tracer here for instant feel
	end)

`GetMouseLocation` returns viewport coordinates, as `ViewportPointToRay` expects. For first-person aiming, use `camera.ViewportSize / 2`.

**Server (Script in ServerScriptService)**

	local RANGE, DAMAGE, FIRE_GAP = 300, 20, 0.15
	local lastShot: {[Player]: number} = {}
	local params = RaycastParams.new()
	params.FilterType = Enum.RaycastFilterType.Exclude

	fire.OnServerEvent:Connect(function(player, aimPoint)
		if typeof(aimPoint) ~= "Vector3" then return end
		local m = aimPoint.Magnitude
		if m ~= m or m == math.huge then return end -- NaN or infinite

		local char = player.Character
		local head = char and char:FindFirstChild("Head") :: BasePart?
		local hum = char and char:FindFirstChildOfClass("Humanoid")
		if not head or not hum or hum.Health <= 0 or not char:FindFirstChildOfClass("Tool") then return end

		local now = os.clock()
		if now - (lastShot[player] or 0) < FIRE_GAP then return end
		lastShot[player] = now

		local offset = aimPoint - head.Position
		if offset.Magnitude < 0.1 then return end
		local direction = offset.Unit * RANGE
		params.FilterDescendantsInstances = {char}
		local result = workspace:Raycast(head.Position, direction, params)
		if result then
			local model = result.Instance:FindFirstAncestorOfClass("Model")
			local target = model and model:FindFirstChildOfClass("Humanoid")
			if target and target.Health > 0 then
				target:TakeDamage(DAMAGE) -- respects ForceFields
			end
		end
	end)

	game.Players.PlayerRemoving:Connect(function(p) lastShot[p] = nil end)

**What to know**
- `workspace:Raycast` returns nil on a miss, or a result with `Instance`, `Position`, `Normal`, `Distance` and `Material`. The direction's length is the range; a unit vector reaches only 1 stud.
- Add effect folders to the filter; keep ammo, reload and fire rate on the server.
- Show others the shot: the server sends clients the start and end points to draw a tracer.
- The server sees positions slightly late; for lag compensation see combat/server-rewind.
- Slow projectiles (rockets, arrows): move them step by step and raycast each step instead of using Touched.
