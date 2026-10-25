---
title: Rarity titles and aura rigs
topic: vfx/rarity-titles-and-rigs
scope: generic
source: maintainer-skill
tags: aura rarity rng roll summon tier set piece hologram mutation title billboardgui odds collection showcase
---
# Rarity titles and aura rigs

**Titles.** A BillboardGui over the head: a small, readable odds line (white with a stroke) and the name big in a font, gradient and stroke that match the theme (a FontFace per aura). Legendary titles stack layers: a bracketed subtitle, a huge name, sometimes a second word in another font overlapping it. Set MaxDistance so far titles don't clutter the screen.

**Building it.** Each aura is a Model of attachments welded to the HumanoidRootPart; every part Massless with collision, query, touch and shadows off. Move spinning and floating pieces in one client loop. Beyond about 80 to 120 studs, turn emitters off and drop the set piece but keep the cheap floor light and title. Offer a low-VFX setting.
