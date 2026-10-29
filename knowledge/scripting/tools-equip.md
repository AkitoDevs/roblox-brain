---
title: Tool equip and activation patterns
topic: scripting/tools-equip
scope: generic
source: maintainer-skill
tags: tool tools equip equipped unequip unequipped activated backpack starterpack startergear handle grip sword item weapon hotbar give tool requireshandle equiptool
---
# Tool equip and activation patterns

A Tool is an item in the player's hotbar. Unequipped tools live in `player.Backpack`; equipping moves the tool into `player.Character`.

**Setup**
- A held tool needs a part named exactly `Handle` as a direct child; the character's right hand grips it. Adjust the hold with `Tool.Grip` (a CFrame).
- No visible held object (a spell, a placement mode): set `RequiresHandle = false`. If it is true and there is no Handle, Equipped and Unequipped never fire.
- Weld extra parts to the Handle (WeldConstraint) and leave them unanchored, or the player gets stuck.
- `CanBeDropped` defaults to true (Backspace drops it); turn it off for most game items.
- Tools in `StarterPack` are given to everyone on every spawn. To give one from the server: `tool:Clone().Parent = player.Backpack`. To keep it after death, also put a clone in `player.StarterGear`.
- The server can equip or clear with `humanoid:EquipTool(tool)` and `humanoid:UnequipTools()`.

**Client input, server outcome.** `Activated` fires on the client when the player clicks or taps while it's equipped. Play the animation and effect there for instant feel, and send intent to the server, which decides what happens.

	-- LocalScript inside the Tool
	local ReplicatedStorage = game:GetService("ReplicatedStorage")
	local tool = script.Parent
	local useTool = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("UseTool") :: RemoteEvent

	local track: AnimationTrack? = nil
	tool.Equipped:Connect(function()
		local animator = tool.Parent:FindFirstChildOfClass("Humanoid"):FindFirstChildOfClass("Animator")
		track = animator:LoadAnimation(tool:WaitForChild("SwingAnim") :: Animation)
	end)
	tool.Unequipped:Connect(function() track = nil end)
	tool.Activated:Connect(function()
		if track then track:Play() end
		useTool:FireServer(tool)
	end)

	-- Script in ServerScriptService
	useTool.OnServerEvent:Connect(function(player, tool)
		if typeof(tool) ~= "Instance" or not tool:IsA("Tool") then return end
		if tool.Parent ~= player.Character then return end -- must be equipped by this player
		local now = os.clock()
		if now - (tool:GetAttribute("LastUse") or 0) < (tool:GetAttribute("Cooldown") or 0.5) then return end
		tool:SetAttribute("LastUse", now)
		-- do the server-side effect: hit check, heal, place, etc.
	end)

Animations loaded on the local player's own Animator replicate to everyone, so the swing is seen by all.

**Notes**
- Cooldowns, damage and ammo live on the server. A client copy is only for showing a cooldown bar.
- Don't trust a hit the client reports; the server checks it (see combat/melee-hit-detection and scripting/raycast-weapons).
- `ManualActivationOnly = true` stops clicks from firing `Activated`; call `tool:Activate()` yourself (for example from a mobile button).
- Hide the default hotbar with `StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false)` in a LocalScript if you build your own; equip through `humanoid:EquipTool` via a remote.
- Set `ToolTip` and `TextureId` so the hotbar slot reads well.
