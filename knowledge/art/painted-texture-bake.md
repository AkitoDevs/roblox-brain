---
title: Hand-painted look baked in Blender for Roblox
topic: art/painted-bake
scope: generic
source: maintainer-skill
tags: blender stylized hand painted texture bake emission albedo bevel node height gradient ambient occlusion cracks wood grain generator arch stone
---
# Hand-painted look baked in Blender for Roblox

Roblox can't run node trees, so the painted low-poly look is built procedurally in Blender and baked into one albedo texture. These rules came from experiments, including the failures; how the result looks under Roblox lighting still needs checking per kit.

**Order:** blockout and lighting first, then this method for the pieces, and show one in-context render before scaling to a full kit.

**Generators, not hand placement**
- One script per kit family. Build arches from their real centres (equilateral, lancet, four-centred) and order curve points springer, apex, springer, never mirrored apex-first.
- Stones: start from a box, taper the top, and cut with Boolean cubes turned to face the rock squarely, only from above and the sides, at a distance that shaves corners. Random cutter rotations stab concave notches.
- Debris: split pieces with an angled plane into two chunks and cap the cut. Whole blocks read as spare parts.
- Give every leaf, petal and slab its own small offset: coplanar overlaps render as holes or black.

**The painted material**
- Base: a three-stop ramp from a cool dark through a warm mid-tone to a warm light, driven by the normal's Z so tops are lit.
- A height gradient on world Z, because front-facing walls all read mid-tone under a normal-only ramp.
- Per-piece shade stored as an attribute offset from 1 (shade − 1, read back with +1) so it survives joining and missing values read 1, not black.
- Edges from a Bevel shader node (radius about 0.03 to 0.05) compared with the true normal, through a ramp, screened toward a warm light. Not Pointiness: it is per vertex and washes low-poly pieces to white.
- Multiply ambient occlusion (about 0.85).
- Cracks from Voronoi distance-to-edge lines, masked by noise and a wide bevel band so they start at edges.
- Judge albedo in the mid range under the Standard view transform, set explicitly (Blender defaults to AgX).
- Wood: give each piece a grain UV along its long axis before joining and drive a banded wave texture from it (about 1.5 bands per stud; around 4 reads as noise). Bake through a separate bake UV, then delete the grain UV.
