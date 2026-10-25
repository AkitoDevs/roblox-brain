---
title: Building trees for Roblox
topic: art/trees-in-roblox
scope: generic
source: maintainer-skill
tags: tree vegetation foliage trunk branch fork crown clump canopy taper flare stylized blender roblox lollipop
---
# Building trees for Roblox

**Roblox build recipe**
- In Blender: trunk and limbs as one connected mesh with taper; a flare ring at the base; twig tips never at zero thickness; 3 to 7 crown clumps on limb ends as faceted lumps (30 to 80 triangles each) or leaf cards over a rough volume, varied in size, with gaps cut. Copy normals from a sphere onto the clumps for soft shading. Give leaf planes a little thickness rather than relying on DoubleSided. Trunk and leaves as separate meshes in 2 to 3 greens (lighter top, darker underside), well under the mesh triangle limit, pivot at the base.
- Parts-only fallback (a low ceiling; label it as such): 3 to 5 stacked tapered cylinders with a lean, 2 to 4 limbs at 30 to 60 degrees starting inside the trunk, and 3 to 7 overlapping lumps on limb ends with gaps, about 15 to 30 parts reused as a Model.

**Check from a capture, not the plan:** species reads from the silhouette; taper, flare and Y-forks visible; clumps countable and unequal, each attached to a limb; sky shows through; lit top and dark underside; asymmetric; right scale next to a character; no floating joints. Common failures: a uniform tube trunk, plus-sign branches, floating clumps, a solid blob with no gaps, one flat green, perfect symmetry, papery flat cards.
