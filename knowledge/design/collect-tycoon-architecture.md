---
title: Architecture and feel for collect and tycoon games
topic: design/collect-tycoon-architecture
scope: generic
source: maintainer-skill
tags: tycoon architecture processreceipt bootstrap leaderstats profile session lock collectionservice income server input feedback asmr pad press
---
# Architecture and feel for collect and tycoon games

Free kits for this genre usually get these wrong, so check each one deliberately.

**One bootstrap**
- One ProcessReceipt router: dedupe by PurchaseId saved in the player's profile, grant before returning PurchaseGranted, never grant from PromptProductPurchaseFinished.
- One data system with a session lock, and one leaderstats creator. Never let several kits each install these: only the last assignment wins.
- Never write default data over a profile that failed to load.

**Server truth**
- State lives in server tables or the profile and replicates out. UI visibility and loose Value objects are never the source of truth.
- Every remote gets an ownership check, type checks and a rate limit. Perks such as VIP zones are enforced on the server.
- Buy through a ProximityPrompt or a validated remote, not Touched. Multipliers apply once per item (an attribute flag), never once per touch.
- Compute income on the server; coins and drops are client-side cosmetics, not physics parts.
- One CollectionService manager per behaviour instead of a script copied into every part. Modern APIs (task library, Connect, Parent set last).
- Clean up per-player tables, threads and connections on leave, and give every wait on the client a timeout.
- Cache web calls (friends, game pass ownership) instead of polling every second.

**Satisfying input feedback (keys, buttons, pads)**
- Press: about 0.04 s exponential squish. Release: about 0.12 s elastic.
- Hitbox slightly larger than the object, with about 0.15 s of release grace so walking across doesn't flicker.
- Pick sound and particles from the object's category or folder so designers add new types without code. Overlap one-shots and pool or destroy them.
- Echo other players' presses through the server with validation and a rate limit.

**Checklist:** loop, numbers and unlocks in one config; stealing has visible counterplay with per-victim protection; rebirth shows cost, progress, requirements and physical unlocks; a single receipt router with dedupe; perks enforced on the server; press and collect feedback fast, layered and leak-free.
