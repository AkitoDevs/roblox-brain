---
title: VFX building blocks: beams, trails, meshes and lights
topic: vfx/beams-trails-meshes-lights
scope: generic
source: maintainer-skill
tags: vfx particleemitter beam trail mesh flipbook squash drag velocityparallel velocityperpendicular lightning debris glyph light flicker
---
# VFX building blocks: beams, trails, meshes and lights

**Beam.** Lasers, light pillars, ribbons, curved orbit rings. The texture's top maps to Attachment0. Beams also make cheap ground decals: two attachments rotated so the beam lies flat, FaceCamera off, Transparency 1, 0, 1 along the length for soft ends, different Width0 and Width1 for a fan. Jagged lightning: a chain of short beams between attachments along a path with random sideways offsets, re-randomised every few frames.

**Trail.** On moving attachments for slashes, sparks and comets. WidthScale 1 to 0 tapers it, Transparency 0 to 1 fades it, Lifetime 0.25 to 0.6 s sets the tail length, LightEmission 1. Call Trail:Clear() when a looping head jumps back to its start, or a streak cuts across the effect.

**Mesh VFX.** Sphere, ring, crescent and swirl meshes in Neon or ForceField material, or a textured mesh for painted energy. Tween Size, CFrame and Transparency from a start state to an end state for shockwaves, domes and slashes. A sequence of meshes swapped every frame (a mesh flipbook) plays a fully 3D animated shape such as a splash.

**Debris and glyphs.** A few real parts thrown on arcs then faded and removed; scorch slabs that fade. Ground glyphs as a Decal, SurfaceGui or flat Beam on a thin part, rotated slowly, with a glow disc and an expanding outline ring.

**Lights.** Brief Brightness tweens at impact; coloured lights on moving heads; SpotLight where a beam hits the ground. Steady flames flicker with Brightness = base × (1 + amp × 2 × math.noise(t × speed, seed)).

**Legacy Fire and Smoke objects** ignore emitter-rate graphics settings and are often re-enabled by settings scripts: replace them with emitter-based flame templates.

**Motion.** Everything moves a little: counter-rotating rings, slowly turning circles, random Rotation and RotSpeed. Pop in at size 0, 1.2, 1 with ease-out; expansions ease out, collapses ease in. Drive moving effect parts on the client with one loop (CFrame or BulkMoveTo), never physics.
