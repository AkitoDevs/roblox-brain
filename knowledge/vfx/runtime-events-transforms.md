---
title: VFX runtime: events, transforms and hygiene
topic: vfx/runtime-events-transforms
scope: generic
source: maintainer-skill
tags: vfx runtime emit enable disable attributes emitdelay emitcount module retime rescale recolor pooling spam safe cleanup architecture
---
# VFX runtime: events, transforms and hygiene

- **Event pieces:** a child named for an event (such as OnDisable) emits when the parent is disabled, so a held beam can end in an explosion. A random container picks N of its children per emit (sound variations, alternate slash shapes).
- **Links outward:** an ObjectValue piece can trigger things outside the effect (a UI vignette, a screen tint). Script pieces may run custom logic but must clean up everything they create.
- **Spam safe:** re-emitting resets running tweens and stops old repeats instead of stacking. Compute each effect's maximum lifetime from delays, durations, repeats and particle lifetimes, and destroy the clone after it.
- **Whole-effect transforms:** retime (speed, rate, lifetime, delays and tween times together), rescale (sizes, speeds, light range, beam widths, sound rolloff, optionally the parts too), recolour (shift hue, saturation and lightness across every Color property).
- **Extensible types:** a registry where a module adds emit, enable and disable handlers for new piece types (mesh tweens, craters and spikes, procedural lightning, impact frames, camera shake).
- **Graphics settings:** if a setting scales emitter rates, give every emitter a base-rate attribute that the setting multiplies, so quality changes never re-enable effects you switched off.
- **Library hygiene:** tag textures and sounds by use, store only changes from defaults, and keep assets you depend on uploaded to your own account or group so they never fail to load.
- **Third-party VFX plugins** distributed outside the Creator Store run with full Studio access: get them only from the author's official page and review what they insert.
