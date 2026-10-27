---
title: Grounding, orientation and sightlines
topic: building/grounding-placement
scope: generic
source: maintainer-skill
tags: grounding trees roots rocks vines orientation sightline arch doorway opening headroom nameplate placement scatter
---
# Grounding, orientation and sightlines

**Things grow out of the ground, they don't sit on it.**
- Trees: the trunk flares at the base and that flare disappears into the floor. Sink the trunk so the floor cuts through the widest part (bury about 10 to 20%), add 3 to 5 root buttresses that dive under the floor, and hide the seam with a soil or moss ring, tufts and leaves. Never show a trunk's flat bottom.
- Rocks bury 20 to 30%; posts are embedded or on a plinth; pillars get a base moulding; crystals emerge from a cracked base.
- Scatter pebbles, tufts, leaves or debris at bases, and break up the edges where two ground materials meet.
- When placing a tree mesh, find the trunk's lowest point and widest section, then lower the model until the floor plane cuts the widest section.
- Scripted grounding: rays hit a mesh's collision shape, so Box or Hull scenery stops them early. Cast against collision proxies or precise-collision parts, exclude the prop, and save original CFrames to undo.

**Organic growth stays connected.** Vines are continuous stems whose segments touch end to end and hug the surface; every leaf hangs from the stem on a short stalk, angled out and down. Hide the leaves mentally: the stem should be one connected path from root to every tip.

**Orientation is part of the model.** Signs and plaques face the approach path, fronts face the player, banners hang plumb, portal surfaces and their effects face the approach axis. Check from player camera height and from the side.

**Frame, don't block.** Arches and pillars should frame what is behind them. Anything meant to be read or admired must be fully visible from the main approach: put it on the arch's axis and far enough beyond it, or move or raise the arch. Test with raycasts from real eye points (standing eye height around 5 studs, and the default camera about 10 to 15 studs behind and above) to points on the display. Raycasts skip CanQuery-off decor, and the default camera only stops at opaque, CanCollide parts.

**Openings sit in walls, not on them.** A doorway, portal or window needs a recess, a frame that meets the wall with trim, a threshold or step, and a dark backing. A frame that just intersects a wall reads as a mistake.

**Leave headroom.** Before placing a character under a canopy or ceiling, check the space for its nameplate and speech bubble. Behind a counter (about 60% of the character's height), raise the character on a hidden step.
