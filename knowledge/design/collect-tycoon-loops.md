---
title: Collect, steal, fuse and tycoon loops
topic: design/collect-tycoon
scope: generic
source: maintainer-skill
tags: game design tycoon collect steal base slots idle income fuse rebirth hazard wave economy pity luck config conveyor
---
# Collect, steal, fuse and tycoon loops

**Loop shapes**
- **Collect to base:** go out, grab an item, bring it home to a slot that earns idle income. Income per slot = base rate × (mutation multiplier + trait bonuses) × player multiplier (rebirth, friends in server, index bonus).
- **Lane with hazards:** a long lane with better items further out, swept by waves on a timer; each tier has a distinct colour, height, speed and label. Safe pockets along the sides.
- **Tycoon:** a data-driven buy chain where each purchase requires a previous one; income from droppers or workers, multiplied by upgraders.
- **Fuse:** put N items in, pay, wait, get one higher-rarity item. Score inputs nonlinearly (a bonus for full sets, matching rarities) so players keep duplicates. Show possible results and odds before committing, and keep inputs visible as ghosts while fusing.

**Economy numbers**
- Exponential stat costs: next point = base × 1.25^(level − start). Tune so outrunning the slowest hazard takes a meaningful chunk of play.
- Milestone gates for new space (extra floors at round numbers or behind rebirths).
- Contested conveyor items priced by times bought turn spawning into a social auction; selling refunds about half.
- Offline earnings per slot with a hard cap, paid out when the player touches the slot's collect pad: a rewarding return moment.
- Server luck = roll N times and keep the rarest. Pity: per-player saved counters, or a clearly shown server-wide timer board. Test the guarantee path end to end.
- Every number (rarities, weights, prices, timers, fuse buckets, rebirth tables) lives in one shared config module.
