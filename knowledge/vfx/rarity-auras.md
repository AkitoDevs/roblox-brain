---
title: Rarity auras and titles that scale with luck
topic: vfx/rarity-auras
scope: generic
source: maintainer-skill
tags: aura rarity rng roll summon tier set piece hologram mutation title billboardgui odds collection showcase
---
# Rarity auras and titles that scale with luck

**Why rarity spectacle works**
1. **The player is the show.** Keep the map a plain, low-contrast stage so every aura stands out; spend the visual budget on what players earn.
2. **Spectacle scales with rarity,** so anyone can read an aura's rarity from across the map without opening a menu.
3. **Each rare aura has one theme** (clockwork, hologram, nebula, holy crystal, underworld portal) carried by its VFX, light colour, floor effect and title font.
4. **The odds are always shown:** "1 in N" above every head, on every result and in the collection. A bigger number is bragging rights.
5. **The world reacts:** each aura lights the floor in its colour.

**Tiers**
- **Very common:** one small effect (faint wisps, a thin ring, a soft glow). One or two emitters at most.
- **Uncommon to rare:** a coloured light pool under the feet (PointLight, Range 10 to 14), a halo or rays, a few sparkles in the tier colour.
- **Epic:** changes the character itself (a replaced head or mask, a flame stream from the head, a glowing chest emblem) plus particles and light. Joke auras sit here too, and they sell.
- **Legendary and up:** a set piece that follows the player: two pillars with glowing tops framing them, a giant slowly turning emblem behind (disc, ring, portal, clock face), a floor circle (runes, a holographic grid, a mist pool), something floating above (a wireframe shape with a bright core, a galaxy swirl), themed ambient particles, and strong coloured light on the floor and nearby players.
- **Dark auras need contrast:** dark smoke (Brightness near 0 or negative LightEmission) packed with tiny bright stars and thin constellation beams, plus one gold accent as a focal point.
- **Hologram:** a grid platform with neon edges, upright transparent panels showing UI-like bars (SurfaceGui, LightInfluence 0, Brightness above 1), a wireframe cube from 12 beams between 8 attachments with a flare at its centre. Stay in one hue.
- **Mutations:** a tagged, renamed, recoloured variant of an existing aura doubles the collection without new art.
