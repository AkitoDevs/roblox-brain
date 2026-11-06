---
title: Mesh vertex colour and weld tips (unverified)
topic: building/mesh-colour-weld-tips
scope: generic
source: community-lesson
tags: vertex colour srgb linear glb blender meshpart color weld motor6d part0 c0 merge
---
# Mesh vertex colour and weld tips

Every line here is **Unverified tip:** material from outside reading, not tested by us.

- **Unverified tip:** vertex colours exported from Blender as GLB can look too dark and over-saturated in Roblox, because the file stores linear values and Roblox is reported to display them as sRGB without converting. Store the sRGB values in the colour attribute only for the export and restore them afterwards. Keep `MeshPart.Color` white, since it multiplies the vertex colours. Confirm by placing a plain part in the intended colour beside the mesh.
- **Unverified tip:** re-pointing an existing Weld or Motor6D to a new Part0 immediately snaps Part1 to the old offset relative to the new Part0, so reading Part1's CFrame afterwards gives the wrong position and merged models collapse onto one spot. Record each joint's Part1 world CFrame first, then change Part0, then set C0 from the recorded CFrame relative to the new Part0.
