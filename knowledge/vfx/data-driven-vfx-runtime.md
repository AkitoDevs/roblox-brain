---
title: A data-driven VFX runtime
topic: vfx/runtime
scope: generic
source: maintainer-skill
tags: vfx runtime emit enable disable attributes emitdelay emitcount module retime rescale recolor pooling spam safe cleanup architecture
---
# A data-driven VFX runtime

Mature Roblox VFX workflows store every effect as plain instances plus attributes and play them through one shared client module. Gameplay code only ever calls emit, enable or disable. Design the format for your game rather than copying a specific plugin's code.

- **Effect = container:** a part, attachment or model holding emitters, beams, trails, lights, sounds and meshes. emit(effect) walks it and plays each piece.
- **Timing attributes** on any piece or container: EmitDelay, EmitCount, EmitDuration (lights hold and sounds loop until it ends), EmitRepeat and EmitRepeatDelay. A delay on a container delays everything inside it, so sub-effects (charge, burst, smoke) are built separately and then combined and offset as blocks.
- **Randomness everywhere:** let any numeric attribute be a range rolled per emit (counts, delays, durations, tween times) so repeated casts never look identical.
- **Emit versus enable:** emit is one-shot. Enable and disable are for sustained effects (a channelled beam, an aura while a buff lasts): tween chosen properties in from a start value on enable and out on disable. Each piece names which properties it tweens (Transparency, Size, widths, Brightness, Range, Volume, Rate). A repeat count of -1 plus enable means loop until disabled.
