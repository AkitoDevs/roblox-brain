---
title: Designing held weapons that read in the hand
topic: art/weapon-design
scope: generic
source: maintainer-skill
tags: weapon sword knife staff gun silhouette detail roughness metalness palette atlas gradient uv projection triangles bevel accent
---
# Designing held weapons that read in the hand

**What good stylised weapons do**
- **A silhouette you can read instantly.** Clear proportions between blade, handle and any guard or ring, with outline features (grip scallops, spine notches) that make it recognisable even as a black shape.
- **The skin bookends the design.** Colour on the blade and the far end with a dark matte handle between them: the dark middle frames the bright parts and makes them pop.
- **One warm accent** (a small slightly emissive pin or gem where blade meets handle) gives the eye a focal point.
- **Big, medium, small detail:** blade, handle and guard; inset grip panels, collars and an edge strip; screws, grip ridges and notches.
- **Materials told apart by roughness as much as colour.** As a guide: coloured blade metalness about 0.7 and roughness 0.25; polished edge 0.95 and 0.2; rubber grip 0.05 and 0.95; matte panels 0.1 and 0.9; dark steel screws 0.8 and 0.4.
- **Palette atlas:** solid-coloured parts share one tiny texture of colour cells (nearest filtering) with each part's UVs pinned to one cell, so many colours live on one mesh and one material and can be merged into a single draw.
- **Gradient skins done right:** project the blade's UVs flat along its thin axis so the gradient flows smoothly from base to tip across the whole curved shape; give the guard or ring its own flat projection. A diagonal hue sweep plus a lighter sheen band reads well.
- **Cheap construction:** 2D outlines extruded with a small bevel; repeated details as copies stepped evenly along a curve.

**Common mistakes to avoid**
- **Dark tones too close together.** Handle, panels and grip at nearly the same near-black value make all the grip detail vanish at game distance. Separate dark tones by at least 25 to 40 levels (out of 255) or add a lighter edge or coloured inlay.
- **An even-thickness blade** looks like a board edge-on. Taper toward the cutting edge with a bevel strip or a wedge cross-section.
- **Teeth stuck on the spine** read as spikes: cut notches in instead.
- **Triangles where they don't show.** Small rings and screws rarely need hundreds of triangles; spend them on the silhouette.
- **Dozens of separate meshes** mean dozens of draws per copy. Merge by material before import: one mesh for skinned parts, one for atlas parts.
