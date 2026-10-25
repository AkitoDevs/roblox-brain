---
title: Weapon slashes and movement VFX
topic: vfx/slashes-movement
scope: generic
source: maintainer-skill
tags: vfx slash trail sword swing dash roll dodge jump landing grapple knockback afterimage readability test combat
---
# Weapon slashes and movement VFX

**A slash is an animated shape, not a transparent curved mesh.** Each one needs a tapered leading edge, a readable trajectory, a controlled thickness profile, deliberate inner and outer silhouettes, directional streaks, a clear peak frame, a quick smooth fade, a colour and shape tied to the weapon, and contrast on both dark and bright backgrounds.

**How good sword games read:** the slash appears at full length on the contact frame as one long, bright, white-cored streak along the swing, then thins and vanishes within 4 to 6 frames; a faint pale swoosh follows the blade; hit-stop at contact; small white spark stars on hits and parries; health bars flash white; a brief red tint on heavy hits; a translucent afterimage on dodges. Anime-style arcs are thin, crisp and long, with tapered ends and often doubled.

**Roblox tools for slashes:** Trail, Beam, ParticleEmitter, attachments, MeshParts, texture effects, tweened meshes, and a PointLight when justified. Blender geometry nodes, simulation caches, compositing and volumetrics do not transfer: bake them to meshes or flipbooks, or rebuild with Roblox systems.

**Readability test:** view the slash against black, against a bright background, over the character, from the real gameplay camera and at small preview size. If it blobs or disappears, fix the silhouette and contrast.

**Movement VFX**
- **Dash:** short directional acceleration, a brief ground response, a narrow trailing ribbon, limited afterimages, fast decay. Never a giant smoke cloud hiding the character.
- **Roll:** small grounded dust, brief directional streaks, a subtle rotational trail if it helps, a compact landing. It must not look like a teleport.
- **Jump:** a short launch response: a little ground dust and a compact upward streak; no long permanent trail.
- **Landing:** light landings get subtle dust, heavy ones a stronger outward ground response, aligned with the ground plane and the real landing point.
- **Grapple:** a brief initiation cue, a clear connection effect where useful, an impact cue on each damage event and a strong release; no long clutter between players.
- **Knockback:** a compact burst at release with streaks in the push direction. VFX never decide physics or damage; gameplay code does.

**Frame-by-frame review:** check anticipation, start of motion, mid-motion, contact, peak, early dissipation and the final frame. No frame should show an unintended giant blob, sudden flash or artefact.
