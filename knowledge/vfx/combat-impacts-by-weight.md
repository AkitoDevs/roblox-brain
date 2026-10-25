---
title: Combat VFX in five layers, and impacts by weight
topic: vfx/combat-impacts
scope: generic
source: maintainer-skill
tags: vfx combat impact hit light medium heavy direction contact frame anticipation dissipation layers fighting game readability
---
# Combat VFX in five layers, and impacts by weight

The goal is not to make things glow: every effect needs a clear focal point, a recognisable silhouette, a deliberate timing profile, contrast with its surroundings, a readable beginning, peak and end, a controlled particle count, and an identity that survives at small size. Complexity is not quality, and one shockwave or glow sphere reused for everything kills identity.

**Five layers (use only the ones that help)**
1. **Anticipation:** particles converging on the blade, glow gathering on the edge, dust shifting, silhouette compression.
2. **Primary action:** a sharp slash ribbon, a tapered flame arc, a compact shockwave, a focused electric burst, a ground crack.
3. **Contact or peak:** a compact flash, a sharp radial burst, a brief impact graphic, a few large angular fragments, one small bright focal point.
4. **Secondary response:** outward debris, a short smoke puff, the trail continuing past contact, dust reacting to the ground, a short recoil ripple.
5. **Dissipation:** fragments shrink and fade, sparks on defined paths, smoke expands and thins, trails taper, embers fade fast. Strong peak, clean ending.

**Impacts match the attack's direction, speed, mass and nature**
- **Light:** very short, a small sharp focal point, minimal debris, a compact directional streak, a clear hit-confirm flash, little smoke.
- **Medium (normal combos, strong kicks):** a pronounced directional burst, a readable impact graphic, a few sparks or shards, a short ripple, brief residue.
- **Heavy (hammers, finishers, knockback):** strong anticipation, a pronounced impact frame, ground debris only if it actually hits the ground, larger angular fragments, forceful outward motion, brief dust. Not every heavy hit fills the screen.

**Direction:** a diagonal slash gets a diagonal streak, an upward attack an upward burst, a ground slam debris along the ground plane, knockback particles along the push. Never centre every impact on screen regardless of where it lands.

**Timing:** the brightest moment lands at or very near the contact frame (drive it from animation markers). Secondary effects may continue, but must not suggest damage at another time.

**Specials and ultimates:** anticipation, a distinct main effect, a clear release, a brief aftermath and a readable return to gameplay. Spectacular, but never a wall of particles: opponents and gameplay cues stay visible, and any flash or overlay is brief and respects accessibility settings.

**Element identities:** give each element or character a structurally different effect (shape, motion and timing), not a recolour. Test by removing colour: each should still be identifiable.
