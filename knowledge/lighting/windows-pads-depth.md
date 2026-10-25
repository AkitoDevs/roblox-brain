---
title: Bright windows, glowing pads and fake surface depth
topic: lighting/surfaces
scope: generic
source: maintainer-skill
tags: window skylight neon bloom blowout pad floor glow normal map materialvariant contact shadow relief surfacegui
---
# Bright windows, glowing pads and fake surface depth

**Windows without blow-out.** A large Neon pane under Bloom becomes a flat white slab. Keep the original part as the camera blocker (CanCollide on, Transparency below 0.25 so camera occlusion stops at it), switch it to SmoothPlastic, and draw the glass on a transparent plate just in front of it:
- one emissive SurfaceGui (LightInfluence 0, Brightness 1.0 to 1.3) with a vertical sky gradient, warm at the bottom and pale blue at the top
- soft dark edge strips for the recess, one soft glow image and a couple of faint glints
- sun-facing windows warmer and brighter; windows in shade cooler and dimmer
- to tint the glass at runtime, tween the white fill frames' BackgroundColor3: it multiplies the UIGradient like stained glass. Beam and emitter ColorSequences cannot be tweened, so lerp them by hand over the same duration.

**Interaction pads.** Avoid camera-facing beams on pads: seen from above they smear across the pad. Build a light curtain instead: a ring of 8 to 10 flat beams (FaceCamera off), one per side. On a non-facing beam the width runs along the attachment's SecondaryAxis, so build each attachment with CFrame.fromMatrix(position, alongBeam, tangent). Use a streaky texture with Attachment0 at the top, Transparency 1 at the top fading to about 0.5 at the ring. Add an emissive glow image on the pad and a fainter, larger one around it.

**Fake depth on flat surfaces.**
- MaterialVariants with a NormalMap and RoughnessMap; StudsPerTile sets the scale. There is no normal-strength slider, so regenerate a variant whose relief is too weak.
- Grazing SurfaceLights or SpotLights reveal relief; flat overhead light hides it.
- EnvironmentSpecularScale with a Sky picks out tile edges and polished stone.
- Contact shadows: soft near-black radial images (0.6 to 0.8 transparency) under columns and furniture, dark gradient strips along wall bases.
- Edge highlights: a thin lighter strip on top edges, a darker one below. Grime overlays at 0.85 to 0.95 transparency.
