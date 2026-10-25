---
title: Responsive UI scaling
topic: ui/scaling
scope: generic
source: own-testing
tags: ui scale offset gui mobile aspect ratio layout
---
# Responsive UI scaling

Players use phones, tablets, consoles and large monitors, so UI must not depend on pixel sizes.

- Size and position with Scale, not Offset. Use Offset only for tiny fixed gaps.
- Set AnchorPoint deliberately (0.5, 0.5 for centered elements) and position at Scale 0.5.
- Keep shapes consistent with UIAspectRatioConstraint instead of fixed pixel heights.
- Cap extremes with UISizeConstraint (MinSize/MaxSize) so panels do not become huge on 4K or tiny on phones.
- For text, use TextScaled with a UITextSizeConstraint, or size text from the parent's AbsoluteSize.
- Lists: UIListLayout or UIGridLayout with AutomaticSize on the container, rather than computing heights by hand.
- Strokes and corners: UICorner supports Scale radius; UIStroke thickness is in pixels, so scale it with a UIScale or compute it from screen size.
- Always check the result in Studio's device emulator (a phone in portrait and landscape, plus a wide monitor) before calling UI done.
- Set ScreenGui.ScreenInsets so buttons avoid notches and the top bar area on mobile.
