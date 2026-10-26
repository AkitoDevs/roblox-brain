---
title: FBX and glTF import scale, mirroring and pivots
topic: building/import-scale-orientation
scope: generic
source: maintainer-skill
tags: blender fbx gltf import 3d scale studs unit scale mirror x axis open cloud rotation pivot hinge pivotto primarypart template offset
---
# FBX and glTF import scale, mirroring and pivots

These were measured in Studio with a test cube, not taken on trust.

**Scale: the route that comes in 1 to 1**
- In Blender's FBX export, set Apply Scalings to FBX Unit Scale (`FBX_SCALE_UNITS`). In Studio's Import 3D, set Scale Unit to Studs. A 4 x 4 x 4 Blender cube then arrives at exactly 4 x 4 x 4 studs, so 1 Blender unit = 1 stud.
- glTF with the default export settings is also 1 to 1.
- "FBX All" (`FBX_SCALE_ALL`) is a generic setting, not the Roblox one. Any recipe whose stud size was never measured is a guess; when size matters, use the measured route.

**Orientation**
- Both FBX and glTF come in mirrored on the X axis through Import 3D. An asymmetric prop (a sign, a hand-held item, a one-sided door) flips, so check its left and right side after every import.
- Meshes uploaded through Open Cloud are not mirrored, but MeshParts imported that way carry a -90 degree rotation about X.
- Fix orientation once per template, not per copy or per effect. Store the correcting CFrame as an attribute on the template and apply it when cloning.

**Pivots for moving props (doors, lids, levers)**
- In Blender, put the origin on the hinge edge (cursor to selected, then set origin) and apply rotation and scale before export.
- In Studio, move the prop with `PivotTo`.
- A model's PrimaryPart overrides its WorldPivot. To pivot at a corner, set the PrimaryPart's PivotOffset.

**Check after import:** the size against a known part, left and right against the reference, and the pivot by rotating the prop once in Edit.
