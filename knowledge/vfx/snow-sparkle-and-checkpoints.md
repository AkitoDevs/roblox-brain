---
title: Snow, sparkle and checkpoint effect budgets
topic: vfx/snow-sparkle-and-checkpoints
scope: generic
source: maintainer-skill
tags: vfx snow particles sparkle checkpoint emitter budget mobile flipbook beam trail light emission
---
# Snow, sparkle and checkpoint effect budgets

- **Emitter caps.** One emitter makes at most 400 particles per second (100 on mobile) and a particle lives at most 20 seconds. Keep snow at 100 per second or less per emitter. Community reports put the visible-particle ceiling near 3,600 on phones, so budget well below it.
- **Snow look.** Many small flakes beat a few big soft ones. Layer fine powder with larger slow flakes. Use LightEmission 0 so Bloom does not blow white snow out; use 1 for sparkle.
- **Coverage.** Cover large areas with a few emitter parts that follow the player and are gated by distance, not one emitter per square. Emitter shapes such as sphere and cylinder belong on a part, not an attachment.
- **Checkpoint reward.** Fire a one-shot burst of 20 to 30 particles plus a beam light column with FaceCamera on. Never depend on a flipbook alone: clients switch flipbooks off when memory is low.
- **Footsteps and trails.** A low-rate glitter emitter on footsteps and a 0.3 to 0.5 second trail read as sparkle. Beams and trails need two different attachments.
- **Motion preference.** Skip or shorten idle jiggles, shine sweeps and confetti when the reduced-motion setting is on.
- **Test** every effect at the lowest and highest editor quality level and on a real phone.
