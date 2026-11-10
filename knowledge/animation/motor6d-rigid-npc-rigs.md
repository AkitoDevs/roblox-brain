---
title: Rigid multi-part NPC and mount rigs on Motor6D
topic: animation/motor6d-rigid-npc-rigs
scope: generic
source: community-lesson
tags: animation motor6d transform anchored part1 massless npc mount rigid mesh preSimulation c0 c1 pivot
---
# Rigid multi-part NPC and mount rigs on Motor6D

- **Anchor only the root and parts no Motor6D drives.** An anchored `Part1` ignores its Motor6D `Transform`, so a rigid piece (a hat, a sub-mesh) stays put while the rest moves. Leave every Motor6D `Part1` unanchored and massless; the anchored root holds the assembly and the transforms move the pieces. Skinned meshes still deform through bones when anchored.
- **Unverified tip:** to animate a multi-mesh NPC with no skinned rig, no uploaded animation and no network cost, join the pieces with Motor6Ds whose `C0` and `C1` are both computed from one shared world-space pivot. Then set `Motor6D.Transform` on each client every PreSimulation step.
- **Unverified tip:** a mount welded inside a player character may have its own leg joints never move if you set their transforms every render frame, because the rider's animator resets every joint inside the character model each frame. Set the mount's transforms in the pre-simulation step, which runs after the animator posed the rig, or keep the mount outside the character model.
