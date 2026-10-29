---
title: Game passes, developer products and ProcessReceipt
topic: monetization/gamepasses-dev-products
scope: generic
source: maintainer-skill
tags: gamepass gamepasses game pass developer product products devproduct purchase buy robux prompt promptgamepasspurchase promptproductpurchase processreceipt receipt marketplaceservice userownsgamepassasync vip
---
# Game passes, developer products and ProcessReceipt

**Game passes** are bought once and owned forever (VIP, double coins). **Developer products** can be bought again and again (coin packs, revives). Prompt on the client; grant only on the server.

**Prompting** from a LocalScript: `MarketplaceService:PromptGamePassPurchase(player, passId)` or `MarketplaceService:PromptProductPurchase(player, productId)`.

**Game passes (server).** Check ownership on join, and grant right away when bought in this session:

	local MarketplaceService = game:GetService("MarketplaceService")
	local Players = game:GetService("Players")

	local function ownsPass(player: Player, passId: number): boolean
		local ok, owns = pcall(MarketplaceService.UserOwnsGamePassAsync, MarketplaceService, player.UserId, passId)
		return ok and owns
	end

	Players.PlayerAdded:Connect(function(player)
		if ownsPass(player, Config.Passes.VIP) then player:SetAttribute("VIP", true) end
	end)

	MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, passId, purchased)
		if purchased and passId == Config.Passes.VIP then player:SetAttribute("VIP", true) end
	end)

**Developer products: one ProcessReceipt.** Only one script may set it; a second one replaces the first. Dispatch by product id and make a repeat call for the same purchase harmless:

	local handlers = {
		[Config.Products.Coins100] = function(profile) profile.coins += 100 end,
	}

	MarketplaceService.ProcessReceipt = function(receipt)
		local player = Players:GetPlayerByUserId(receipt.PlayerId)
		local profile = player and Data.get(player) -- nil until their data has loaded
		if not profile then return Enum.ProductPurchaseDecision.NotProcessedYet end

		if profile.purchases[receipt.PurchaseId] then
			return Enum.ProductPurchaseDecision.PurchaseGranted -- already granted
		end
		local grant = handlers[receipt.ProductId]
		if not grant or not pcall(grant, profile) then
			return Enum.ProductPurchaseDecision.NotProcessedYet
		end
		profile.purchases[receipt.PurchaseId] = true
		if not Data.saveNow(player) then
			return Enum.ProductPurchaseDecision.NotProcessedYet -- retried later; the id stops a double grant
		end
		return Enum.ProductPurchaseDecision.PurchaseGranted
	end

`Data` is your session-locked data module (datastores/session-locking). Saving the `PurchaseId` with the reward makes each purchase count exactly once.

**Rules**
- Return `PurchaseGranted` only after the reward is saved. Until then the purchase stays open and is delivered again, including when the player next joins.
- `PromptProductPurchaseFinished` only reports that the prompt closed. Never grant from it.
- Keep only the last 50 or so purchase ids so the save doesn't grow forever.
- The newer `MarketplaceService:BindReceiptHandler` registers handlers per product id, takes precedence over ProcessReceipt for those ids and returns `Enum.ReceiptDecision` values. Use one system per product.

**Testing.** A Studio playtest makes test purchases (no Robux charged) and the server callbacks still run. Also test leaving mid-purchase and a failing save.
