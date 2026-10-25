---
title: Shading and exporting Blender props for Roblox
topic: building/blender-props-shading-export
scope: generic
source: maintainer-skill
tags: blender fbx export import 3d meshpart triangle limit decimate shade smooth by angle low poly color split mesh static prop
---
# Shading and exporting Blender props for Roblox

**Shading**
- Organic shapes: Shade Smooth.
- Low-segment cylinders: Shade Smooth by Angle with the angle above 360 degrees divided by the side count (10 sides needs more than 36 degrees, so use about 45). Below that the sides stay flat bands; 90-degree rims stay hard.
- Re-running Smooth by Angle keeps earlier sharp edges unless Keep Sharp Edges is turned off.

**Export and check**
- Select every piece before exporting; a missing piece in Import 3D means it wasn't selected.
- In Blender's FBX dialog, "All Local" scaling is the FBX_SCALE_NONE option ("FBX All" is a different one).
- Re-import the FBX into an empty scene: you should see only the intended meshes (no camera or light) with their triangle counts.
- Import 3D options that suit static props: import as a model, insert in Workspace, set pivot to scene origin, anchored.
- If the whole model arrives one colour, the pieces weren't separated. If the size is wrong, scale in Studio or change the export scale and re-export.

**Quality checks:** silhouette matches the reference from front and side; one mesh per colour region; every mesh under the triangle limit; smooth curves with intended hard edges; in Studio every piece imported, anchored, sensibly sized and individually coloured.
