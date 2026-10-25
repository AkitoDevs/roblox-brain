---
title: Lobby NPCs, signs and the build budget
topic: design/lobby-build
scope: generic
source: maintainer-skill
tags: npc nameplate speech bubble billboardgui alwaysontop greet surfacegui sign district anchor mobile budget lobby
---
# Lobby NPCs, signs and the build budget

**NPCs that feel present**
- Each NPC has an original name and a role that fits its area, built with the game's own character builder so it matches the art style.
- Nameplate: name over a small pill with the role or a live timer, just above the head. If canopies or floating decor hang over the NPC, make the plate and speech bubble AlwaysOnTop with a short MaxDistance (about 45 to 60 studs) so props never cover them but they don't show through walls from across the map.
- Greet once when a player comes within about 13 studs, with a cooldown of about 30 seconds. Turn toward a nearby player only within a limited arc (60 to 70 degrees) so a shopkeeper never turns its back on the counter. Gentle idle bob, a small hop when talking; a speech bubble replaces the nameplate while it is up.
- Say a line when the player uses the NPC's prompt and after a purchase. Two or three lines per situation, picked at random, are enough.
- Timed NPCs arrive and leave with a puff and a line, and only exist while their feature is open.
- Give NPCs an invisible collider so players cannot walk through them. Transparent colliders do not stop the camera.

**Building it**
- Districts as Models with an attribute naming the district; gameplay hooks (prompts, touch parts) named and documented.
- Signs: SurfaceGui on both faces (PixelsPerStud 40 to 60, LightInfluence 0), a display font, UIStroke around 3, a neon backing strip plus a PointLight. StarterGui.ShowDevelopmentGui must stay on or SurfaceGuis vanish in Studio.
- Place NPCs and props from invisible anchor parts (bottom face = floor, LookVector = facing) so anyone can move them in Studio without editing code.
- Drive NPC idle motion and floating decor from one client loop that skips anything far from the player; bob anchored parts with a sine of time plus a phase, no physics.
- Live signs: one client loop once per second reads server-replicated attributes and only writes Text when it changed.
- Many small low-rate emitters (2 to 6 per second) beat a few heavy ones.
- Mobile budget for a lobby: about 3,000 to 4,000 anchored parts, at most about 70 lights with shadows off, CastShadow, CanCollide, CanQuery and CanTouch off on decor.
- Editor helpers that untick ScreenGuis for a clean viewport can ship a game with no HUD: have the HUD and loading screen enable themselves at runtime.
