---
title: Porting Blender-made VFX and motion into Roblox
topic: vfx/blender-port
scope: generic
source: maintainer-skill
tags: vfx blender port beam texture mapping attachment additive black background meshpart bounds import keyframesequence timeposition editablemesh card
---
# Porting Blender-made VFX and motion into Roblox

A workflow where effects are made once in Blender and Roblox plays back what Blender produced (rendered cards, flipbooks, meshes and animation data) keeps one source of truth. These facts were verified while doing it.

**Beams as image cards**
- Beam texture mapping: the image's V axis runs along the beam (Attachment0 to Attachment1); U runs across the width, starting on the attachments' +Y side, and the width spans the attachments' Y axis. Assuming U runs along the length shows cards rotated 90 degrees and stretched.
- Parent Attachments before setting WorldCFrame.
- Additive art must have an opaque black background. Storing intensity in alpha shows faint glow as a grey box.
- Split a glow into a sharp card plus a low-resolution haze card, with the sharp card windowed to zero at its border.

**Solid things look solid.** Physical elements (crystals, rocks, plates) must be faceted geometry with a key light baked into per-facet colours, plus additive inner glow and edge glints. Translucent additive tubes read as flat 2D shapes. Creature heads and bodies need a dark solid base with glowing rims and edges; an all-glow head loses its structure. Validate with a side, front and three-quarter study before baking.

**Meshes**
- Roblox MeshParts are centred on their bounds, so centre every exported mesh on its bounding box in Blender and take base sizes from the Blender data.
- Runtime mesh creation is limited: asset-creation APIs aren't available from some tool contexts, and in published places EditableMesh needs the Mesh and Image APIs allowed in Game Settings and the client memory budget fails after a few meshes. Import the meshes with Studio's 3D importer instead, store them under ReplicatedStorage and clone by name.

**Animation data**
- Export each part's CFrame relative to its parent per key, then in Roblox set Pose.CFrame = Motor6D.C0 inverse × relative × Motor6D.C1 using the rig's real C0 and C1, build a KeyframeSequence, register it for a Studio test id and load it with the Animator.
- Drive TimePosition with playback speed 0 for exact pause and seek in a showcase.
- Publish the KeyframeSequence through the Animation Editor for a real id.

**Transfer tips**
- In Edit mode, Studio can read a local export server once HttpService is enabled (turn it off afterwards), which beats pasting large data.
- Ship slim game data (no vertices, rounded numbers) rather than the full export.
- Draw particle randomness before any visibility skip, or particles jump between frames.
