---
title: Pathfinding clearance and arrival tips (unverified)
topic: scripting/pathfinding-npc-tips
scope: generic
source: community-lesson
tags: pathfinding nopath clearance header ramp moveto computeasync reach tolerance npc attack distance float
---
# Pathfinding clearance and arrival tips

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us.

- **Unverified tip:** if an NPC on a raised area gets `NoPath` to every point off it, look for collidable decoration overlapping the exits and for low headers. Measure header clearance from the raised floor, not from ground level, against the agent's height.
- **Unverified tip:** a quick split test is a direct `Humanoid:MoveTo`. If it walks but `ComputeAsync` fails, the problem is navmesh clearance, not the target. Moving ramps clear of decoration and raising the header fixed it in the reported case.
- **Unverified tip:** if an NPC steps toward a target by `min(speed*dt, dist - reach)` and attacks only when `dist <= reach`, floating point can leave it a hair outside reach, so it walks forever. Keep walking only while `dist > reach + 0.25` (a small tolerance) so the move and attack checks cannot disagree at the boundary.
