---
title: VFX layer ownership and hit-flash tips (unverified)
topic: vfx/vfx-layer-ownership-tips
scope: generic
source: community-lesson
tags: vfx layers ownership pooling highlight flash flipbook sampling beam trail ribbon moving carrier particles budget
---
# VFX layer ownership and hit-flash tips

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us.

- **Unverified tip:** give every effect layer one owner and one lifetime rule. Three useful kinds: actor-bound layers (follow a character and die with the move), world-wake layers (stay in the world where something passed) and contact bursts (one-shot at the hit point). A layer with no owner leaks or never cleans up.
- **Unverified tip:** reset pooled effects fully on reuse: enabled flags, rate, transparency, attachment parent and any attributes the sequence set. A reused emitter that keeps the last use's state is the usual cause of "it only breaks the second time".
- **Unverified tip:** flash the victim with a Highlight only after damage is confirmed, for a few frames. A flash on a blocked or missed hit teaches players the wrong thing.
- **Unverified tip:** a Trail on a fast-moving, fast-turning carrier can show kinks and gaps. A Beam stretched between two attachments that follow the motion may give a cleaner ribbon.
- **Unverified tip:** for flipbook sheets, play at a steady rate and keep the frame count modest; too few frames strobes, too many wastes texture memory. Judge it in motion, not as a still.
- **Unverified tip:** cap an effect's size by its height on screen rather than in studs, so it still reads from far away without covering the character up close.
- **Unverified tip:** keep a particle budget per tier: a basic hit in the tens of particles, a signature move around a hundred, a finisher a few hundred, and test the busiest frame with several players casting at once.

Tested emitter, trail and light limits are in the emitter facts entry.
