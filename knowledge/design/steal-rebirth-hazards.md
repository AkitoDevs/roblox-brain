---
title: Stealing, rebirth and hazard design
topic: design/steal-rebirth-hazards
scope: generic
source: maintainer-skill
tags: game design tycoon collect steal base slots idle income fuse rebirth hazard wave economy pity luck config conveyor
---
# Stealing, rebirth and hazard design

**Stealing needs counterplay**
- The thief must be inside the base volume (server bounding-box check), needs a free slot, carries the item visibly overhead, moves slower and loses tools until it ends. Death, leaving or rebirth returns the item.
- Base locks: a timer that grows with rebirth, a re-lock cooldown after a forced unlock, a friends allowlist, bright lock bars that read instantly.
- Protection per victim, never one global cooldown.

**Rebirth.** The panel shows a money progress bar, required items as 3D tiles with owned or missing states, every unlock with its value, and a red warning of what resets. Each rebirth unlocks something physical (a floor, slots, lock time, a tool), not only a multiplier. The server re-checks every requirement and grants atomically.

**Hazard waves.** Colour = threat. A paid, server-broadcast summon needs a real queue so two purchases don't overwrite each other. Move visuals on the client; decide kills on the server from lane maths (start + speed × elapsed versus player position), not Touched on moved parts. Give waves a crest and motion, not a flat wedge.
