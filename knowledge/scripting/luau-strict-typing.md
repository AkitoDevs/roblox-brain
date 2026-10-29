---
title: Luau strict typing basics
topic: scripting/luau-strict-typing
scope: generic
source: maintainer-skill
tags: luau type types typing strict nonstrict annotation export type typeof cast generics type checker script analysis typed class metatable unknown narrowing
---
# Luau strict typing basics

Put `--!strict` on the first line of new scripts and modules. The type checker then flags nil access, wrong argument types and misspelled fields in the Script Editor and the Script Analysis window before you press Play. Types are checked while editing only; they change nothing at runtime, so they cost no performance.

**Annotations**

	--!strict
	local MAX: number = 10
	local names: {string} = {}               -- array
	local scores: {[Player]: number} = {}    -- dictionary
	local target: Model? = nil               -- Model or nil

	local function addScore(player: Player, amount: number): number
		local new = (scores[player] or 0) + amount
		scores[player] = new
		return new
	end

**Type aliases and exporting them from modules**

	export type ItemData = {
		id: string,
		price: number,
		rarity: "Common" | "Rare" | "Epic", -- only these strings are allowed
	}
	-- another script: local Items = require(path); local x: Items.ItemData

**Narrowing.** Checking a value refines its type inside the branch:

	remote.OnServerEvent:Connect(function(player: Player, amount: unknown)
		if typeof(amount) ~= "number" or amount ~= amount then return end
		-- amount is a number here (and not NaN)
	end)

Type remote arguments as `unknown`: it forces a check before use, which is exactly what remote security needs.

**Instances.** `WaitForChild` and `FindFirstChild` return a general Instance, so cast when you know the class, or check with `IsA`, which also narrows:

	local remote = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("BuyItem") :: RemoteEvent
	local part = workspace:FindFirstChild("Door")
	if part and part:IsA("BasePart") then
		part.Anchored = true -- part is a BasePart here
	end

A `::` cast is a promise to the checker, not a runtime check. Use it only when the structure is guaranteed.

**A typed object with methods**

	local Inventory = {}
	Inventory.__index = Inventory
	type Fields = {owner: Player, items: {string}}
	export type Inventory = typeof(setmetatable({} :: Fields, Inventory))

	function Inventory.new(owner: Player): Inventory
		return setmetatable({owner = owner, items = {}}, Inventory)
	end
	function Inventory.add(self: Inventory, item: string)
		table.insert(self.items, item)
	end
	return Inventory

**Common errors and fixes**
- "Value of type 'X?' could be nil": check `if x then` first, or use `if x then ... else ...` expressions.
- "Type 'Instance' could not be converted into 'Part'": add an `IsA` check or a cast.
- Unknown field on a table: declare the full table type up front instead of adding fields later.
- Avoid `any`; it switches checking off for everything it touches. Fix the annotation rather than dropping to `--!nonstrict`.

Generic functions (`local function first<T>(list: {T}): T?`) keep types flowing through helpers.
