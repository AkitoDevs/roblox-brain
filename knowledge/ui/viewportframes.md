---
title: ViewportFrames for 3D in UI
topic: ui/viewportframes
scope: generic
source: maintainer-skill
tags: viewportframe 3d ui model preview card portrait turntable worldmodel camera framing fov lighting inspect
---
# ViewportFrames for 3D in UI

**Engine behaviour**
- A ViewportFrame renders its children through CurrentCamera. Objects show only when parented inside it (or inside a WorldModel inside it). Clone models; never move workspace originals into UI.
- The Camera does not replicate: create it on the client, parent it to the frame and assign CurrentCamera.
- Lighting is the frame's own: Ambient, LightColor and LightDirection (the direction light travels). No shadows and no post-processing.
- Environment lighting acts as zero, so PBR materials look flatter. A Sky child becomes a reflection cubemap.
- Neon and Glass render at low quality: use bright plain colours for glow parts.
- In practice particles, beams, trails, lights, SurfaceGuis and BillboardGuis don't show inside a viewport. Strip them from clones and fake glow with bright parts and a UI glow image behind the frame. Decals, Textures and SurfaceAppearance do render.
- A WorldModel lets rigs animate and parts be raycast, but nothing is physically simulated. Create one only when needed.
- Update the view by moving the camera, not the objects.

**Setup.** Prepare a template once per item: clone, remove scripts, sounds, lights, emitters and welds, anchor every part with collision, query, touch and shadows off, and pivot it to the origin. Cache templates and clone the cached copy per card. For long lists, show the card frame at once and fill the 3D model through a time-sliced queue (about 5 to 6 ms of work per frame). Keep rarity backgrounds and glows in normal UI layers behind the transparent frame.

**Framing.** Fit a whole model with its bounding sphere (radius = bounding box size magnitude / 2), not its largest side, which clips corners. FieldOfView is vertical, so compute the horizontal half-angle from the aspect ratio and use the smaller one: distance = radius / sin(half-angle), plus about 5%. Portraits: FOV 30 to 40, focus about 30% below the top of the model, three-quarter angle. Scenes: FOV 50 to 70, camera slightly above looking down.

**Motion.** Turntable by orbiting the camera; rotate LightDirection with the camera if the light should stay fixed to the viewer. Animate only the selected or hovered card, at about 30 Hz, only while visible. Animated characters go in a WorldModel and play through their Animator on the client.

**Performance.** Static cards are cheap; animated ones are not. Keep at most about 3 animating viewports at once on mobile. Reuse one detail viewport for inspect screens. Set Visible = false when off screen, and destroy frames, clones and cameras and disconnect loops on close.
