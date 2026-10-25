---
title: Part techniques, z-fighting audits and part budgets
topic: building/part-techniques
scope: generic
source: maintainer-skill
tags: parts wedge cylinder ball meshpart csg union zfighting coplanar flicker audit budget statue figure builder
---
# Part techniques, z-fighting audits and part budgets

**Decor settings.** Anchored; CanCollide, CanTouch and CanQuery off; CastShadow off unless the piece is large.

**Shape quirks**
- A Ball part always stays a uniform sphere when resized, so stretched round forms need a cylinder, a capsule (cylinder plus two balls) or a mesh.
- A Cylinder's axis is its X axis: rotate 90 degrees about Z for a vertical column or disc.
- A MeshPart's TextureID overrides its Color: clear the texture to recolour it.
- CSG operands must be parented to Workspace when you union or subtract them.
- Organic shapes (animals, trees, cloth, characters) look better as meshes; keep parts for architecture and hard-surface props.
- Recolour shared meshes with Color or SurfaceAppearance.Color instead of new assets. MaterialVariant on the part, or an override in MaterialService for a global look.

**Never let surfaces z-fight.** Two coplanar overlapping faces flicker. Decide which should show and lift it off the plane along its normal by 0.01 to 0.05 studs (more for big surfaces seen from far away). Typical cases: paths on lawns, floor inlays, decals on walls, crossing beams, ring segments whose corners overlap (alternate their heights).

**Z-fight audit (run after every build pass).** For every part face, bucket faces by normal and plane offset, then test same-facing coplanar pairs for 2D overlap with a separating-axis test on the face rectangles. Nudge the smaller face toward the viewer in steps that differ from its neighbours (for example 0.012, 0.024, 0.036) and re-run until there are zero hits.

**Builders.** Helper functions for crates, barrels, rocks, tufts and lamps with built-in jitter make variation automatic. Author figure builders in a local frame (feet at the origin, front = -Z, CFrame.lookAt(base, base + facing)) so one function places, scales and turns a statue anywhere.

**Statues from parts.** Two or three silhouette features that read across a room (a plume, a cape, a planted sword), then block big, medium, small. Stone with one metal accent and one fabric colour. If the architecture already has a tall pedestal, give the figure a low plinth instead.

**Replacing a model:** move the original to a backup folder with a note instead of deleting it.

**Budgets:** a typical prop 5 to 30 parts; a statue or NPC 20 to 40; a hero set piece 40 to 150. Merge static decor into meshes where counts climb, and check total parts and lights for mobile.
