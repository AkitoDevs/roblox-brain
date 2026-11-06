---
title: Purchases, saving and teleport tips (unverified)
topic: scripting/purchases-data-teleport-tips
scope: generic
source: community-lesson
tags: process receipt developer product not processed yet datastore settings overwrite studio test store teleport retry stamp
---
# Purchases, saving and teleport tips

Lines marked **Unverified tip:** come from outside reading and have not been tested by us. The one unmarked line is a plain API fact.

- The members of `Enum.ProductPurchaseDecision` are `PurchaseGranted` and `NotProcessedYet`. A handler that returns a misspelled member (such as "NotYetProcessed") throws on every retry, and nobody notices while no products are on sale. Keep the member in a constant.
- **Unverified tip:** run the grant inside a `pcall` and record the receipt only after it succeeds.
- **Unverified tip:** code run from a plugin or command context may get its own copy of required ModuleScripts. Test the handler with stub dependencies or a test hook rather than expecting the live game's module state.
- **Unverified tip:** if a player changes a setting before their saved settings reach the client, do not send the whole settings table. That overwrites every saved value with defaults. Hold early changes, remember which settings they touched, merge them over the loaded save, and send the merged set once.
- **Unverified tip:** a Studio playtest with API access writes to the same DataStores as live servers. Choose the store name with `RunService:IsStudio()` so tests use a separate store, and skip bans in Studio while still logging them, flagged as a test.
- **Unverified tip:** an admin panel that runs a command and instantly requests data can trip its own remote's rate limit. Wait slightly longer than the limit, and give the data request its own slower limit.
- **Unverified tip:** a failing `TeleportAsync` can both throw into `pcall` and fire `TeleportInitFailed`, scheduling two retries. Keep one job per player with a stamp number; each retry bumps the stamp and a delayed retry runs only if its stamp is still current. Add a watchdog for teleports that neither fail nor leave.
