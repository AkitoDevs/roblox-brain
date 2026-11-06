---
title: Obby course layout, pacing and checkpoints
topic: design/obby-course-layout-and-pacing
scope: generic
source: maintainer-skill
tags: obby obstacle course layout pacing difficulty curve checkpoint respawn stage teaching hub retention
---
# Obby course layout, pacing and checkpoints

**Layout**
- Build ONE continuous winding ground-level course. No disconnected clusters and no floating islands over a void; themed zones are stretches of the same path.
- One stage = one obstacle = one checkpoint pad, with a pad between every obstacle. Make each obstacle 4 to 8 jumps (about 10 to 30 seconds) long, never a single platform, so a fall costs at most one obstacle.
- Obstacles are the environment (a cookie, a gumdrop, an ice floe), not bare primitives or textured blocks. If you cannot name the real object a platform is, redesign it.
- Put a calm hub with one set piece after each zone, and give the spawn something to look at.

**Pacing**
- Stage 1 is large, forgiving and distinctive. Stages 1 to 5 are the most polished part of the game: they decide whether a new player stays past the first minute or two. They must be passable at a slow walk with no timed hazards.
- Teach each mechanic alone: a safe version first (a fall does not kill), then the lethal version, then a twist, then a combination of already-taught obstacles. Let the geometry teach; avoid signs. A stage should be describable in about three words.
- Raise difficulty one notch at a time, add a breather after each punishing obstacle, and vary jump type and spacing (never one jump five times in a row or one hazard ten times).
- Aim for 1 to 3 tries on a normal stage and 3 to 5 on combination or finale stages. Tag stages by difficulty and length and place them on a planned curve. Expect about 80 percent skill and 20 percent chaos.
- Offer one tuned course plus an optional, neutrally named helper (skip, more forgiving landing) instead of easy and hard copies of every stage. Never mark players who use it.

**Checkpoints and respawn**
- The pad must look safe (never a kill-coloured block), its trigger larger than the pad, and a clear should reward the player (a burst of particles, a light column, a sound). Show a stage counter such as 12/150.
- Set the respawn delay to 1.5 to 2 seconds explicitly, give each player their own respawn location, add a kill plane under the course, and make sure one player's death or checkpoint never affects anyone else. Save the stage number only, and revert suspicious positions instead of kicking.
- Test with two real clients and a low-end phone before calling anything done.
