---
title: Mirroring rotated parts across a plane
topic: building/mirroring-rotated-parts
scope: generic
source: community-lesson
tags: mirror reflect cframe rotation matrix euler wedgepart cylinder symmetric flip
---
# Mirroring rotated parts across a plane

Negating Euler angles to mirror a part across the X = 0 plane often flips a wedge's slope or a cylinder's axis once more than one axis is rotated. Mirror the whole CFrame matrix instead.

**The rule.** Negate the position's X. For the rotation, flip the signs of the four off-axis terms that touch X and keep the rest: from `CFrame:GetComponents()` returning `x, y, z, r00, r01, r02, r10, r11, r12, r20, r21, r22`, negate `x`, `r01`, `r02`, `r10` and `r20`, and leave `r00`, `r11`, `r12`, `r21`, `r22` as they are. This is the rotation conjugated by a flip of X, so its determinant stays +1 and the result is a normal CFrame (no scale flip needed).

**Why it is safe.** The mirrored part only keeps its shape if the shape looks identical when flipped across its own local X axis. Block, Ball, Cylinder (its axis is local X) and WedgePart (slope in the local Y-Z plane) all pass. A MeshPart with different detail on its left and right needs a mirrored mesh as well.

**Check.** Mirror a few corners of the original by hand (negate their X) and compare them with the matching corners of the mirrored part; they should agree.
