---
title: In-world viewports and planar reflections
topic: ui/viewport-reflections
scope: generic
source: maintainer-skill
tags: viewportframe surfacegui reflection water mirror fountain planar minimap pixelsperstud in-world screen
---
# In-world viewports and planar reflections

**In-world screens.** Put the ViewportFrame inside a SurfaceGui (LightInfluence 0 for screens) or a BillboardGui. A SurfaceGui under PlayerGui with Adornee set keeps it client-only. Render cost grows with canvas pixels, so keep PixelsPerStud modest (20 to 50) and stop far screens from rendering (MaxDistance on BillboardGuis, hide distant SurfaceGuis). SurfaceGuis are single-sided, and each face maps canvas axes to world axes differently: check with a test label before doing any math.

**Planar reflections (water, mirrors).** Mirroring the camera onto a SurfaceGui is wrong: the image is projectively distorted and handedness flips. Instead:
1. **Mirror the geometry, not the camera.** Clone only the focal objects (a showcase hero, a fountain centrepiece) and place each clone at its mirrored CFrame across the plane: reflect the position and every axis, then negate the up axis so the result is still a proper rotation. Symmetric parts come out exact; meshes come out left-right swapped, which reads fine in water.
2. **Put the viewport camera at the real eye position, looking perpendicular into the plane** (straight down for water). The image plane is then parallel to the surface and maps onto it with only a scale and an offset, which UI can do.
3. **Use an oversized, offset square frame.** With d the eye height above the plane and need the largest horizontal distance from the point under the eye to a corner of the surface, FOV = min(120, 2 × atan(need / d)) and half-size r = d × tan(FOV / 2). Make the frame 2r × PixelsPerStud square, centred on the canvas position under the eye. The SurfaceGui clips the excess.
4. **Mirror the key light too:** flip the Y component of LightDirection.
5. **Blend it in:** ImageTransparency 0.35 to 0.6, a water-tint ImageColor3, a soft gradient edge and a ripple overlay. Fade it out when the needed FOV passes 120 degrees (grazing views) or the eye drops below the plane.
6. **Budget:** one reflection surface per area, focal clones only, about 30 Hz updates, only within about 60 studs. Huge reflective floors are too expensive: use Reflectance or SurfaceAppearance there.

**Common mistakes:** a camera created on the server, objects not parented into the frame, moving the model instead of the camera, expecting particles or Bloom inside the frame, a fish-eye FOV on portraits, the SurfaceGui on the wrong face, and ShowDevelopmentGui off hiding SurfaceGuis in Studio.
