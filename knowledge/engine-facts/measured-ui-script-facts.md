---
title: Measured UI and scripting behaviours (gradients, positions, text boxes, caches, strings)
topic: engine-facts/measured-ui-script-facts
scope: generic
source: own-testing
tags: colorsequence numbersequence keypoints uigradient uistroke textscaled uiscale absoluteposition ignoreguiinset textbox focuslost releasefocus gsub datastore cache setasync getasync playeradded local image cache imagerectsize
---
# Measured UI and scripting behaviours

Each point below was measured in Studio (October 2026) and changes how you should write code.

**UI**
- **ColorSequence and NumberSequence hold at most 20 keypoints.** More errors with "table is too long". Rebuilding a sequence every frame for a travelling band is fine.
- **A UIGradient under a UIStroke multiplies the stroke's own colour.** A black stroke with a rainbow gradient draws black. Set the stroke colour to white.
- **TextScaled stops growing at 100 px, and the cap applies after a parent UIScale.** You can't make huge logo text with TextScaled; render big titles as images (each 1024 px or smaller).
- **AbsolutePosition leaves out the top-bar inset**, even inside a ScreenGui with IgnoreGuiInset on (a full-screen frame reported y = -58). Before tweening a Position to line up with another element, subtract the container's own AbsolutePosition.
- **Studio caches images loaded from local asset paths by file name.** Overwriting a local PNG keeps showing the old picture; give every changed image a new file name.
- **A negative ImageRectSize X (a mirror) renders nothing.** Flip the art in the image instead.

**Text boxes**
- Pressing Return through an input-simulation tool did not fire FocusLost with enterPressed. What worked: wait until the box has focus, set its Text, then call `ReleaseFocus(true)`, which fires FocusLost with enterPressed = true. Useful for testing a real submit path.

**Scripting**
- **gsub returns two values** (string and count). Passed straight into `table.insert` or `string.format` it shifts the arguments; wrap the call in parentheses.
- **A server's own DataStore writes refresh its cache.** After `SetAsync(2)` or `UpdateAsync(3)` on one server, a normal `GetAsync` there returns the new value immediately. The cache only hides writes made by other servers, so read keys that other servers write with the cache off.
- **A module required after a player has joined misses PlayerAdded for that player.** Also loop over `Players:GetPlayers()` once when the module starts.
- **Studio Play can read and write real DataStores** once API access is turned on for Studio; with it off, calls error with "Studio access to APIs is not allowed". Use a separate store name when `RunService:IsStudio()` is true so tests never touch live data. BindToClose runs when Play stops, and a save there completes.
- **Script Source is capped at 200,000 characters** on the property setter (199,990 worked); the script editor service accepted a longer write. Split very large generated scripts into modules.
