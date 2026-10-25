---
title: Designing and building collectible sets in Roblox
topic: art/collectible-sets-build
scope: generic
source: maintainer-skill
tags: collectibles eggs pets chests capsules voxel set theme core glow silhouette palette rarity ornament hatch presentation
---
# Designing and building collectible sets in Roblox

**Recipe:** fix the base form, size, core position and lighting first. Per set choose a material language, one core colour and a small palette. Per item pick the creature's 2 to 3 defining features (outline first, then markings, then clothing) and make the shapes point at the core. Check the front view alone (can you name the creature and the set?), then the three-quarter view: sides need detail too. Review the whole set side by side under the same light so inconsistencies jump out.

**In Roblox**
- Author in a voxel editor, export a mesh with its palette texture and import one MeshPart per item with merged faces. The palette texture holds every colour on one material.
- Put the core and glowing cracks in a small separate Neon mesh, plus a PointLight in the core colour (Range 6 to 10) so the glow lights the pedestal.
- Building voxels from parts costs hundreds of parts per item: only for a single hero display, never a catalogue.
- Display with a gentle bob and slow turn in one client loop; pulse the core light slightly.
- Hatch: shake with growing intensity, cracks brighten, a flash in the core colour, a burst of themed particles, then the reveal.
- Icons: render the front view in a ViewportFrame or pre-render images on a dark tile with a soft glow in the set colour.
