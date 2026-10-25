---
title: Roll reveals, biomes and the systems around RNG games
topic: design/rng-reveals
scope: generic
source: maintainer-skill
tags: rng roll summon reveal cutscene skip threshold equip delete warning biome weather collection showroom daily quests onboarding hud
---
# Roll reveals, biomes and the systems around RNG games

**Pace the reveal by rarity**
- **Low tiers (about 1 s):** the name slot cycles through names in their rarity colours like a slot machine, slowing down, then lands; the result appears centred with "1 in N" under it and a quick tinted edge flash; then big Equip and Delete buttons. Build the cycling by swapping Text and TextColor3 on a timer whose interval grows each step.
- **High tiers (several seconds):** cut to black with a single four-point star flare in the rarity colour growing in the centre (an ImageLabel tweened small to large with ease-in, rising sound, a white flash), then cut to the result in that aura's styled title. The wait builds the excitement.
- **Skips:** players set a rarity below which cutscenes skip; rare cutscenes can be replayed from the collection.
- **Protection:** equipping something worse than what you wear asks for confirmation, deleting anything above a rarity threshold warns first, and players set both thresholds.
- **Roll bar:** one big Roll button bottom centre with a small counter, auto and quick toggles beside it; each locked toggle says what unlocks it.

**Biomes and weather.** The server cycles biomes and time of day, and each changes the whole map (snow whitens the grass, a sandstorm adds dense Atmosphere and long gust streaks, night makes auras glow brighter). Show the current biome and time in a HUD corner and announce changes in chat. Some results only roll in certain biomes, which brings players back for the weather.
