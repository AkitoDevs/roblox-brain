---
title: Visual tests for slashes
topic: vfx/slash-visual-tests
scope: generic
source: maintainer-skill
tags: vfx slash easing timeline layers editablemesh assetservice createmeshpartasync transparency chunks visual test camera edge-on
---
# Visual tests for slashes

**Visual tests before calling a slash done**
- A test bay with a neutral checker floor, a character stand-in, a placeholder weapon, a marker at the origin, an arrow on the initial tangent, and a dotted guide whose dots grow toward the end.
- Capture gameplay (behind), top and side views at p around 0.08, 0.2, 0.45 and 0.75, and check: direction, curvature flips, side flips, the head never moving backwards, and the first visible tail at the origin.
- **Edge-on trap:** a slash plane containing the camera's forward axis is a thin line from the gameplay camera. Choose the plane normal against the gameplay camera, or add a crossed second ribbon.
- Stills are not motion: judge the final slash playing at full speed.
- Improve one thing at a time in the generator, and compare before and after from the same camera at the same p.
