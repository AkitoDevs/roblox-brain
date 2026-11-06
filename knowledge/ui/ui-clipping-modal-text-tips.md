---
title: UI clipping, modal and sign text tips (unverified)
topic: ui/ui-clipping-modal-text-tips
scope: generic
source: community-lesson
tags: ui clipsdescendants rotation canvasgroup popup overflow modal shade outside tap surfacegui textscaled pixelsperstud
---
# UI clipping, modal and sign text tips

Every line here is **Unverified tip:** material from outside reading, not tested by us.

- **Unverified tip:** rotating an ancestor of a frame that uses `ClipsDescendants` can switch the clipping off for everything below it, so a fill bar shows its full contents. Never rotate an ancestor of a clipped frame, even slightly. Make a tremble effect with small Position offsets and restore the rest position afterwards.
- **Unverified tip:** a pop-up wrapped in a CanvasGroup for an easy group fade clips anything drawn outside its bounds, such as rays or glows. If decoration overflows, keep the root a plain transparent frame and animate it with a UIScale, or make the group large enough to contain the overflow.
- **Unverified tip:** a full-screen TextButton used as a modal shade can close the dialog even when the tap landed on the dialog box inside it, and `Active = true` on the child frame is reported not to stop the parent's Activated. Compare the input position with the box's AbsolutePosition and AbsoluteSize and close only for taps outside it, or make the shade a sibling behind the box instead of its parent.
- **Unverified tip:** text on a large SurfaceGui sign can look tiny even with TextScaled on, because TextScaled stops at 100 pixels and a high PixelsPerStud gives the label far more pixels than that. Use a low PixelsPerStud (around 8) on big signs, and check the text from gameplay distance.
