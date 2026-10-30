---
title: Measured Studio, rendering and import behaviours (glass, fog, import, defaults)
topic: engine-facts/measured-render-import-facts
scope: generic
source: own-testing
tags: glass surfacegui billboardgui transparency atmosphere fog cylinder facets front back face import glb obj vertex colors clocktime replicate defaults particleemitter beam highlight sound material corrugatedsteel
---
# Measured Studio, rendering and import behaviours

Each point below was measured in Studio (October 2026).

**Rendering**
- **Glass hides GUIs behind it.** A SurfaceGui or BillboardGui behind a Glass part does not render. For a pane with images behind it use SmoothPlastic at about 0.8 to 0.93 transparency.
- **A SurfaceGui on a part at Transparency 1 does not render.** Use about 0.98.
- **Atmosphere density 0.3 (the default in new places) fogs SurfaceGui content even at LightInfluence 0.** Layers about 200 studs away read pale blue; keep stacked "window" layers within about 40 studs of the glass.
- **Cylinder parts are polygons whose flat sides stick out past the nominal radius.** Anything that must show at radius r needs roughly 3% of r clear space. For smooth rings, build from box segments.
- **SurfaceGui faces:** on an axis-aligned part the Front face looks toward -Z, so art meant to face +Z goes on the Back face.
- **A metal ceiling in a closed room reflects the sky as a grey haze;** concrete stays dark.
- **Enum.Material.CorrugatedSteel does not exist** (script error); use Metal or DiamondPlate.

**Import**
- **GLB base colours are dropped:** differently coloured materials all import grey. Colour the MeshParts in Studio.
- **OBJ object groups merge into one MeshPart** unless you split them.
- **FBX vertex colours are multiplied into the texture.** Remove colour attributes before export if you baked masks into them, or the result looks dark or tinted.

**Replication and defaults (Instance.new, read back)**
- Lighting.ClockTime replicates from server to client.
- ParticleEmitter: Rate 20, Lifetime 5 to 10, LightEmission 0, LightInfluence 0. A write of Rate 1000 or Lifetime 30 is accepted, so no clamp on the property (a runtime cap wasn't measured).
- Beam: Width 1, Segments 10 (2000 clamps to 1000). Trail: Lifetime 2. Highlight: FillTransparency 0.5, OutlineTransparency 0.
- Sound Volume defaults to 0.5; AudioPlayer Volume to 1.
- `Animator:ApplyJointVelocities` exists; `Humanoid.ApplyJointVelocities` does not.
