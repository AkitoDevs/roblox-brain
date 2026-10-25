---
title: Recreating a scene from a single reference image
topic: building/reference-recreation
scope: generic
source: maintainer-skill
tags: reference recreation perspective vanishing point camera solve focal length blockout landmarks crop fieldofview lens shift photo scene
---
# Recreating a scene from a single reference image

**The rule:** no detail, materials, lighting or props until the camera and the primary-volume blockout match the reference. Wrong geometry is never hidden with detail.

**Order:** composition, camera, silhouette, primary volumes, check, proportions, secondary forms, materials, lighting, detail, check again (are the focal landmarks still visible?), compare.

**Analyse the reference**
- Note the image type and any lens distortion. Painted or stylised references may not obey one pinhole camera: report the mismatch rather than forcing it.
- Read coordinates from zoomed crops, not the whole frame.
- Perspective type: are verticals parallel? Do "frontal" edges slope slightly (a two-point clue)?
- Collect long, well-separated lines per world axis, any horizontal circles (which appear as ellipses), and landmarks split into ones used to fit the camera and ones held back to check it.

**Solve the camera**
- Two orthogonal vanishing points give the focal length. With one-point perspective the focal length is an assumption unless a depth cue confirms it (a square floor plan, a circle, a tile diagonal). Include at least one check landmark that responds to focal length.
- Trace every usable edge and solve by least squares with outlier rejection. Far-wall corner junctions in one-point scenes fake a second vanishing point. Reflections in dark or glass photos create fake ones: trace those edges by hand.
- Check repeating bays (pillars, windows) for real spacing before assuming they are equal.
- **Camera height comes from a believable object size.** An assumed eye height once produced a five-metre sofa with a low error score.
