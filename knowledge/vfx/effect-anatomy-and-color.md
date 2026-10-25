---
title: VFX anatomy, colour and timing
topic: vfx/anatomy
scope: generic
source: maintainer-skill
tags: vfx effect layers core body glow ground color ramp anticipation impact follow-through emit flash particles timing
---
# VFX anatomy, colour and timing

**Build every effect in layers**
- **Core:** small, near-white, brightest part (LightEmission 1).
- **Body:** the main saturated shape (flipbook fire, energy sphere, swirl, slash, strand mesh).
- **Glow:** a large soft halo sprite at low opacity plus a PointLight flash.
- **Secondary:** orbiting rings and trails, shockwaves, arcs, sparks stretched along velocity, debris, smoke.
- **Ground contact:** glow disc, scorch, magic circle, dust ring, cracks, splash. Effects without ground contact float and feel weak; the floor should react and keep a residue for 1 to 3 s.
- **Screen and environment:** bloom spike, a ColorCorrection tint, impact frames, camera shake, sound, a brief hit-stop on big impacts.
- **The effect lights the world:** coloured PointLights (Range 10 to 16, Brightness 2 to 4, Shadows off) riding on moving heads paint the floor and nearby characters. This one trick makes effects feel expensive.
- Group layers under named attachments (Flash, Main, Smoke, Rings) on one invisible host part so each can be tuned and fired alone.

**Colour**
- Temperature ramp: white core, saturated hue, deeper edge. Fade to transparent, never to black.
- One dominant hue per element family with a complementary accent in sparks or the core. Multi-colour effects use evenly spaced, equally bright hues.
- Animate colour and transparency over lifetime instead of static values.
- Brightness above 1 glows through Bloom. Negative LightEmission (-2 to -3) with high Brightness keeps a colour saturated on bright backgrounds. A white smoke texture with Brightness near 0 renders as dark smoke.
- Additive layers add up: if the centre turns into a flat white blob in Play, lower sprite Brightness and opacity until the structure reads. Keep one deliberate hot core, not a white field.
- Author in white or one base hue so the whole effect can be recoloured later.

**Timing**
- **Anticipation (0.2 to 1 s):** particles converge (ShapeInOut Inward), charge glow grows, embers gather.
- **Impact (0.05 to 0.15 s):** 2 to 4 huge flash sprites (Lifetime 0.1 to 0.15, Brightness 15 to 30, fast ease-out growth), Emit bursts, shockwave, light flash, shake. Delay half the flash sprites by 0.02 s so they read as one rich pop.
- **Follow-through (0.5 to 3 s):** lingering embers, smoke, fading rings, ground residue.
- Fire bursts with ParticleEmitter:Emit(n) and Rate 0.
- Big effects tell three beats: caster, projectile, target.
- **Targets react:** sparkles at the hit point, a 0.08 to 0.12 s white flash on the target, a little knockback.
