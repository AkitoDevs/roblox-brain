---
title: Obby mechanics checked against the docs
topic: engine-facts/obby-mechanics-checks
scope: generic
source: maintainer-skill
tags: respawn spawnlocation touched collision group physicsservice player collision jump height prismatic server authority
---
# Obby mechanics checked against the docs

- **Jump.** Defaults: jump height 7.2, jump power 50 (used while UseJumpPower is true), gravity 196.2, walk speed 16, giving a flat reach near 8.67 studs. No source says R6 and R15 differ.
- **Respawn.** `Players.RespawnTime` defaults to 5.0 seconds; set 1.5 to 2 for an obby. `Player.RespawnLocation` takes a SpawnLocation in Workspace that is Neutral or matches the player's team colour. `SpawnLocation.Duration` is a ForceField time that defaults to 10 seconds, so set 0 for checkpoints. With several eligible spawns the engine picks one at random.
- **Touched.** It fires only from physical movement, needs at least one unanchored part (two anchored parts never fire it) and CanTouch on both. Fast movement can skip a thin pad, so use a larger invisible CanTouch volume (at least the pad footprint, about 4 studs tall) or poll with a box query.
- **Players not colliding.** Register one group, make it non-collidable with itself, and set `BasePart.CollisionGroup` on every part of each character on spawn and on new descendants. Use the Workspace methods: the older PhysicsService calls are deprecated. Up to 32 groups; "Default" is reserved; registering costs more with more parts, so do it at edit time when possible and only from server scripts. `TouchesUseCollisionGroups` defaults to false, so Touched still fires between players. Unconfirmed reports of clients ignoring groups mean you should test with two real clients.
- **Server authority** is a full opt-in release that changes replication and input handling; do not enable it for an obby without a two-client test.
- **Lighting.** The technology property is deprecated and read-only; use the lighting style and quality-priority properties instead.
- **Data.** A value can be up to 4 MB; request budgets scale with player count, with a throttle queue of 30. Save the stage number on checkpoint reach (throttled by your own choice), on leave and in the shutdown handler.
