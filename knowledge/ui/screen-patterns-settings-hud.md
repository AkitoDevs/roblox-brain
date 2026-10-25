---
title: Screen patterns for settings, menus and HUD
topic: ui/screen-patterns-settings-hud
scope: generic
source: maintainer-skill
tags: ui inventory backpack hotbar showcase grid rarity tabs stats settings toggle skill tree radial menu dialog overhead tag status bar loot prompt
---
# Screen patterns for settings, menus and HUD

- **Skill tree:** circular nodes in rings or rows; grey locked, gold owned, blue available or selected; cost above, name below; connecting lines.
- **Settings:** grouped recessed rows (label and a one-line hint on the left, control on the right); sliders with a chunky handle and a percentage; toggles as animated switches; a code redeem box with a result line under it.
- **Animated toggle:** tag each toggle and let one controller drive them all. Stack two prepared state visuals (glowing ON track with the knob right, flat OFF track with the knob left) and cross-fade them; move the knob with Back Out over about 0.4 s; on switching on, sweep the gradient in and let glow and sparkles arrive a beat later. Expose a Toggled event.
- **Radial quick menu:** 6 to 8 ring segments with icons, the hovered one outlined in the accent colour, the centre shows name, description and action hint. Great for gamepad and touch.
- **Dialog:** a name plate above a translucent dark box, typewriter text, a blinking continue arrow, optional character art cut in from the side.
- **Loot pickup prompt:** compact rows beside the crate (category-coloured icon block, name, an upgrade arrow if it is better, count) plus key chips (take all, examine).
- **Overhead tags:** role line, name, rank badge, small icons; modest MaxDistance and size.
- **Status bars:** framed bar with centred value text, a lighter "recent damage" trail behind the fill, thinner secondary bars, segment ticks on XP bars.
- **Focus for modals:** tween a blur and a 40 to 60% dark overlay while a modal is open.
- **Gamepad hints:** a label plus controller glyph shown only while the gamepad is the preferred input; on PC a keybind letter can be a button's main glyph.
