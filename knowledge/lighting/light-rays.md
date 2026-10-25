---
title: Light rays that never look like parts
topic: lighting/light-rays
scope: generic
source: maintainer-skill
tags: light rays sun shafts god rays beam window glow dust pool facecamera texture
---
# Light rays that never look like parts

Never build a light shaft from a Neon or transparent cylinder or block: it always reads as a solid object.

**Use Beams with soft textures.** FaceCamera on, LightEmission 1, LightInfluence 0, TextureSpeed 0 (light does not flow). The top of the image maps to Attachment0, so put Attachment0 at the light source.

- **Texture families:** broad washes for windows, cones for lamps and spotlights, bursts or uplight cones for pads and portals. A round glow stretched along a beam gives a soft body with no visible edge. Preview candidate textures side by side on a dark board before choosing.
- **Fewer, fainter layers.** Two or three beams per opening: two broad washes (lower and upper half) plus one very soft body. With textures that already carry alpha, peak Transparency about 0.65 to 0.8 and Brightness 1.1 to 1.3. Four stacked beams at 0.3 to 0.5 turn into fog.
- **Fade in from the source.** Transparency 1 at the start, peak around 0.15 along the beam, a slow rise to about 0.8, then 1 at the end. A hard start makes a bright band at the window.
- **Check the worst view.** Looking along a row of windows stacks every shaft. Tune for that view, then check from the side.
- **Fade near the camera.** A camera-facing ribbon right next to the camera fills the screen with haze. On the client, a few times per second, find the camera's closest point on each tagged beam and cut a transparent hole in the Transparency sequence around it. Only rebuild the sequence when the quantised position changes. With streaming, a beam can arrive before its attachments: queue it and retry.
- **Dust:** a few long-lived glow motes inside the shaft (about one per second, lifetime 5 to 9 s, LightEmission 1).
- **Every ray lands somewhere.** Draw the opening's shape on the floor: project each outline point along the light direction to the floor height, then draw soft pane shapes on an emissive SurfaceGui just above the floor. Leave the gaps between panes as soft shadow lines.
- **Context:** rays read best in darker spaces. In a bright hall, darken the surroundings slightly or the rays vanish.
