---
title: Auditing free-model kits before reuse
topic: security/free-model-kits
scope: generic
source: maintainer-skill
tags: free model toolbox kit backdoor audit require loadstring getfenv processreceipt leaderstats cleanup inventory
---
# Auditing free-model kits before reuse

Use this when a place is full of Toolbox kits ("ungroup in ServerScriptService" models, tutorial kits) and you want to learn from them, reuse parts or clear them out.

**1. Inventory first, read-only.** For each top-level child of every service: descendant count, script count, lines of code and the most common classes. List every script with its path and line count. Skip well-known libraries (ProfileStore, Promise, Knit, Trove, Signal, Janitor, Zone, TopbarPlus and similar) except to note how they are wired. Read every README: it shows intended placement, required settings and which parts are deliberately blank.

**2. Security scan.** Search all sources for require with a number, getfenv or setfenv, loadstring, InsertService:LoadAsset, HttpService post or request calls, webhook or discord strings, escaped byte strings, string.char or string.reverse chains, very long single lines, and unexpected TeleportService calls or purchase prompts. Report each hit with its line.

**3. Expect these traps.**
- Tutorial kits often ship with code removed ("watch the video"), placeholder globals that are nil, and config modules that are referenced but missing.
- Several kits each assigning MarketplaceService.ProcessReceipt or creating leaderstats: only the last one wins. Merge them behind one bootstrap.
- Purchases granted from PromptProductPurchaseFinished, client-only perks, unvalidated remotes, GetAsync plus SetAsync saves with no session lock.
- Lighting effects or MaterialVariants left inside Workspace folders, where they do nothing.
- Plugin cache folders inside Terrain belong to a plugin, not the game: leave them.

**4. Learning from kits.** Study code systems, monetization and data, and visuals in separate read-only passes. Take principles and numbers; never copy code, layouts, names or art.

**5. Clearing.** Undo recording may not be available from an external tool, so Ctrl+Z is not guaranteed: say beforehand that the safe restore is closing without saving or using version history. Clear Workspace children except Camera and Terrain, clear terrain voxels and empty other services as asked, yielding between large subtrees. Afterwards verify each service is empty and report what was kept and why.
