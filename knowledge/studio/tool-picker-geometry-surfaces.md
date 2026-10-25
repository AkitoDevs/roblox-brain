---
title: Picking the right Studio tool for geometry and surfaces
topic: studio/tool-picker-geometry
scope: generic
source: maintainer-skill
tags: studio geometryservice csg subtract fragmentasync meshpart specialmesh editablemesh surfaceappearance materialvariant decal texture neon light bevel kit prefab
---
# Picking the right Studio tool for geometry and surfaces

Each choice below was tested in Studio.

- **Openings, carved grooves, chamfers, rounded blocks:** GeometryService Subtract or Intersect with UsePartColor on. Results arrive unparented. There is no scripted Separate.
- **Breakable props and rubble:** GeometryService:FragmentAsync(part, seedPoints) returns MeshPart pieces with the material kept; offset each along (seed − centre).
- **Curved shapes that need true collision:** a MeshPart. A SpecialMesh collides as its box.
- **Quick generated mesh for a test:** EditableMesh then AssetService:CreateMeshPartAsync. Ship uploaded assets, though: saving and publishing Editable content is not established.
- **Bevels without a bevel tool:** intersect with a box rotated 45 degrees, WedgePart coves, or per-face normals on an EditableMesh. All read as dressed edges.
- **Repeated wall pieces and building families:** prefab Models with a corner pivot, fixed dimensions and connector attachments on each side, placed by a module on a fixed grid. Use separate ground-floor and upper-floor variants: repeating the plinth on upper floors reads as stacked boxes.
- **Hero prop surface:** SurfaceAppearance (colour, normal, roughness, metalness) on a MeshPart. Metal reflects the sky while grooves stay matte.
- **Glow only on details (runes, eyes):** SurfaceAppearance's emissive mask, with the mask dilated into a halo of about 4 px; 1 to 3 px strokes read faint.
- **Tiled surface family on Parts:** a MaterialVariant with uploaded maps. A MaterialVariant using EditableImage maps rendered flat grey.
- **Image on a face:** a Decal for a one-off (it stretches); a Texture with StudsPerTileU/V for repeats.
- **Moss and grime:** an alpha decal with a soft edge, olive rather than bright green, gathered where water would sit. Hard-alpha bright green reads as camouflage.
- **Normal-map strength:** about 1.5 times the height gradient read as stone; 5 times read as crumpled bark.
- **A glowing source that lights a room:** Neon plus a Point, Spot or SurfaceLight of the same colour; Neon alone leaves the room dark.
- **Warm neon:** use a deep colour such as (255, 90, 25); lighter warm tones clip to yellow.
- **Natural variation (rocks):** a seeded generator, moss from the face normal, scatter by footprint spacing with slope tilt and a slight sink at the rim.
- **Clouds:** the Clouds object must be parented to Terrain; elsewhere it just hazes the sky.
- **Highlights:** at most 255 at once; delete rather than disable unused ones.
