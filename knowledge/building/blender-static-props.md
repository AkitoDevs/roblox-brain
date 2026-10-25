---
title: Static props from Blender into Roblox
topic: building/blender-props
scope: generic
source: maintainer-skill
tags: blender fbx export import 3d meshpart triangle limit decimate shade smooth by angle low poly color split mesh static prop
---
# Static props from Blender into Roblox

For solid-colour props built in Blender and coloured in Studio (no UV textures, rigs or VFX).

**Who does what.** An AI tool can model, split, decimate, shade and export the FBX, and check it by re-importing it into an empty Blender scene. The Studio import (File, Import 3D) has to be done by a person in Studio; colouring and placing the MeshParts afterwards can be scripted.

**Build low-poly from the start**
- Cylinders at about 10 to 11 sides instead of the default 32; ico spheres instead of UV spheres.
- **One colour = one mesh.** Separate each colour region into its own named object so each becomes its own MeshPart and takes its own Color and Material in Studio. Pieces of the same colour that don't touch can share one mesh.
- **Close the cuts.** Splitting leaves both pieces open at the cut. Roblox draws only front faces, so if a piece is moved or resized and the cut becomes visible, it looks see-through: fill the boundary edges.

**Triangles.** The current limit is 20,000 triangles per mesh; around 10,000 is a comfortable target. Count triangles per object with modifiers evaluated. In testing, a dense ico-sphere cap of about 82,000 triangles decimated (Collapse) to about 9,000 with no visible change at normal distance. Prefer Collapse and lower the ratio until under target; Un-Subdivide suits subdivided meshes; Planar at 15 to 30 degrees wrecks organic shapes. Always compare before and after side by side.
