---
title: ProximityPrompt interaction patterns
topic: scripting/proximity-prompts
scope: generic
source: maintainer-skill
tags: proximityprompt proximity prompt interact interaction press e hold door chest pickup shop npc talk proximitypromptservice prompttriggered triggered holdduration collectionservice tag
---
# ProximityPrompt interaction patterns

A ProximityPrompt shows a key hint ("E Open") when a player is close, and works with keyboard, gamepad and touch with no extra code. Parent it to a BasePart, an Attachment (to place it exactly) or a Model with a PrimaryPart.

**Useful properties**
- `ActionText` (default "Interact") and `ObjectText` (empty): the verb and the object, for example "Open" and "Chest".
- `HoldDuration` (default 0): seconds to hold; `Triggered` fires only after the hold completes.
- `MaxActivationDistance` (default 10 studs) and `RequiresLineOfSight` (default on; turn it off for prompts inside parts).
- `KeyboardKeyCode` (default E) and `GamepadKeyCode` (default ButtonX).
- `Enabled`: hide the prompt while something is in use or on cooldown.
- `Style = Custom` hides the default look; then draw your own UI in a LocalScript from `PromptShown` and `PromptHidden`.

**One server handler for many prompts.** Tag each interactable with CollectionService (for example the tag `Chest` on the part that holds the prompt) and listen once through ProximityPromptService:

	local CollectionService = game:GetService("CollectionService")
	local ProximityPromptService = game:GetService("ProximityPromptService")
	local Players = game:GetService("Players")

	local lastUse: {[Player]: number} = {}
	Players.PlayerRemoving:Connect(function(p) lastUse[p] = nil end)

	ProximityPromptService.PromptTriggered:Connect(function(prompt, player)
		local chest = prompt.Parent
		if not chest or not CollectionService:HasTag(chest, "Chest") then return end

		-- the server re-checks distance and state; prompts can be fired by exploiters
		local root = player.Character and player.Character:FindFirstChild("HumanoidRootPart") :: BasePart?
		if not root then return end
		local distance = (root.Position - chest:GetPivot().Position).Magnitude
		if distance > prompt.MaxActivationDistance + 5 then return end
		if os.clock() - (lastUse[player] or 0) < 1 then return end
		lastUse[player] = os.clock()

		if chest:GetAttribute("Opened") then return end
		chest:SetAttribute("Opened", true)
		prompt.Enabled = false
		-- grant the reward on the server, then re-enable after a respawn timer
		task.delay(30, function()
			chest:SetAttribute("Opened", nil)
			prompt.Enabled = true
		end)
	end)

The small extra margin on distance allows for lag between what the client and server see.

**Patterns**
- **Door:** toggle an attribute, tween the door on the server (or on each client from the attribute) and change `ActionText` between "Open" and "Close".
- **Per-player prompts** (a quest only some players have): set `Enabled` from a LocalScript. That only hides it for that player; the server handler must still check the player's quest state.
- **NPC talk:** prompt on an Attachment at the head; the client opens the dialog UI on `Triggered`, and anything with a reward goes back through a validated remote.
- Keep prompt text short so it stays readable on phones, and leave a few studs between prompts so two don't fight for the same key; `Exclusivity` controls whether several can show at once.
