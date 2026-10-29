---
title: Teams and spawns for lobby and arena games
topic: scripting/teams-and-spawns
scope: generic
source: community-lesson
tags: teams team spawn spawnlocation spawn point neutral lobby arena teamcolor autoassignable loadcharacter late join respawn round match spawning wrong place
---
# Teams and spawns for lobby and arena games

Round-based games move players from a lobby into an arena and back. Spawning is driven by Teams and SpawnLocations, and two behaviours cause most of the "players spawned in the wrong place" bugs.

**A Neutral SpawnLocation takes everyone.** With `Neutral = true` it accepts players from every team, so team players can randomly spawn in the lobby. Give the lobby its own Team and set the lobby SpawnLocation to that team's colour with `Neutral = false`.

**Setup that works:**
- **Lobby team** (for example grey) with `AutoAssignable = true`. Make it the only auto-assignable team, so new and late joiners always land in the lobby and never drop into a running match.
- **Match teams** (for example red and blue) with `AutoAssignable = false`.
- **Arena SpawnLocations** use the match team colours and stay `Enabled = false` except while that arena is in use. A disabled spawn is skipped, so an unused arena never receives anyone.

**Starting a round (server):**
For each arena spawn, set `Enabled = true`. Then for each contestant, set `player.Team` to a match team (for example alternate red and blue) and call `player:LoadCharacter()`, which respawns them at a spawn of their new team.
Set `Team` **before** `LoadCharacter`, because the spawn is picked when the character loads.

**Ending a round:** set everyone back to the lobby team, call `LoadCharacter`, then disable the arena spawns again.

**Round timer without remotes:** publish the state and an end time as attributes, for example `SetAttribute("EndsAt", workspace:GetServerTimeNow() + 90)`. Clients count down from `workspace:GetServerTimeNow()`, the shared clock, so HUDs stay in sync with no per-second RemoteEvent. See scripting/round-game-loop for the full loop.

**Check it:** start a test server with 3 players, join a 4th mid-round, and confirm the late joiner spawns in the lobby and that no one appears in an unused arena.
