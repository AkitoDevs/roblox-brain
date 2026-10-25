---
title: Giving menus rich, cohesive detail
topic: ui/menu-detail
scope: generic
source: maintainer-skill
tags: ui menu premium detail layers ornament palette typography title card ribbon icon composition shop panel
---
# Giving menus rich, cohesive detail

What separates a premium Roblox menu from a default one is layering and restraint, not more stuff.

1. **Depth in layers, back to front:** base colour, soft light (glow, rays), mid-ground shapes (rings, bokeh, pattern patches), ornaments framing the content, content cards, foreground particles. Every decorative layer stays subtle (5 to 35% opacity) so content reads first.
2. **Ornament frames the content.** Flourishes sweep around and behind the cards, with one or two crossing in front; interleaving sells depth. Clusters sit at corners and edges, never in the middle.
3. **One motif at three scales:** big clusters, medium accents, tiny confetti (laurels, sparks and embers for a fantasy arena; crystals, snowflakes and frost dots for ice).
4. **Restrained palette:** one dark base hue family, one light "ink" (cream, peach, ice), one accent metal, one motif colour. Borders, text and ornaments reuse the same ink. Disabled states are a desaturated theme hue, never generic grey.
5. **Display typography:** one characterful title font and one supporting font. Titles get a 2 to 3 px dark outline, a soft drop shadow and a gentle vertical gradient.
6. **Title lockup:** hairlines on both sides fading outward, ending in small diamonds in the accent colour, with a one-line subtitle (such as the currency balance).
7. **Cards:** generous corner radius (16 to 24 px), dark fill at 85 to 92% opacity, a thin 2 to 3 px border in the ink, centred hierarchy of icon, big number, name, action. Every card shares radius, stroke and padding.
8. **Break the grid a little, on purpose:** a ribbon tag rotated about 3 degrees straddling a card's top edge, the featured card raised 8 to 12 px.
9. **Controls match the theme:** full-round pill buttons and a circular close button. No default grey squares.
10. **Illustrated icons** in one family; show value by quantity (one coin, a pouch, a pile, a chest).
11. **Light belongs to something:** a glow sits behind the thing that emits it (the selected item, the claimable reward) and takes its colour.

**Budgets:** at most about 60 decorative instances per full-screen menu and about 20 animated ones. Decor is never Active and never blocks taps; keep it under one low-ZIndex folder frame. Check at phone size: no overlaps, nothing tiny, every tap reachable.
