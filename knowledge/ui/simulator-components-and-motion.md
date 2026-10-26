---
title: Simulator UI components and motion
topic: ui/simulator-components
scope: generic
source: maintainer-skill
tags: ui simulator item card rarity tabs rewards daily rebirth offer hud popup hover press toggle rainbow border sunburst motion module
---
# Simulator UI components and motion

**Pick one school per game**
- **Stud-chunky:** charcoal panels with a darker inner bar, saturated gradient headers (gold, red, blue), the stud texture everywhere, a diagonal glare stripe on headers, heavy font with a black stroke.
- **Glossy cartoon:** candy gradients with diagonal white shine streaks, rounder corners, lighter panels, ribbon headers, tilted double cards.

**Component recipes**
- **Item card:** icon tile in a rarity-coloured frame, white name with a small coloured category tag, a dim stock line, a green price, a green Buy (grey when unavailable) and a magenta Robux pill.
- **Rarity tabs:** a ladder of named tiers, each with its own colour (for example silver, gold, cyan, pink, orange, then rainbow for the top tier); cards reuse their tab's gradient.
- **Rewards grid:** each cell has three states (a green claim button, a white countdown, a check when claimed), a claimed-out-of-total counter and a HUD button that lights up when something is ready.
- **Daily rewards:** days 1 to 6 as small cards, day 7 as a big special card.
- **Rebirth:** the current and next rebirth level as two green pills with an arrow between them, a red warning line, a progress bar showing current currency against the requirement, the rebirth button and a Robux skip button.
- **Offer card:** a short hook (limited quantity, a multiplier, or "permanent"), a rotating sunburst behind it and a rainbow-stroke border.
- **Nine-slice frames:** `ScaleType = Slice` with `SliceCenter` in source pixels (a 48 px image with 16 px corners is `Rect(16, 16, 32, 32)`) keeps the corners the same size on any frame size, where `Stretch` squashes them into ellipses. `SliceScale = 2` doubles the corner size. Tested on several label sizes; check one frame in Play before using it across a whole UI.
- **HUD:** a two-column left button grid with notify badges, currency pills bottom-left, big gradient money text, boost badges bottom-right, top tabs.
