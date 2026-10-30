---
title: Animation baking and contact tips (unverified)
topic: animation/baking-contact-tips
scope: generic
source: community-lesson
tags: blender bake euler rotation flip pivot contact reach r6 export frame rate time subframe qa
---
# Animation baking and contact tips

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us. Test it on one clip before baking a whole set.

- **Unverified tip:** when baking rotation curves out of Blender, make each frame's Euler rotation compatible with the previous one (the Euler "compatible" fix-up) before writing keys. Otherwise a joint can jump 360 degrees between frames and show up in Roblox as a spin or a twitch.
- **Unverified tip:** probe fractional times too. Sample the baked data at half frames and compare with the source; an error that hides on whole frames shows up as a pop at other playback speeds.
- **Unverified tip:** when a pose is stored relative to a moving pivot, correct the root position each frame so the pivot stays where intended: root(t) = pivot minus rotation(t) applied to the centre offset.
- **Unverified tip:** check authoring frame rate against the target. Frame numbers noted at 30 fps must be converted before reuse in a tool that authors at 60.
- **Unverified tip:** a numeric "pop screen" catches bad keys cheaply: flag any joint whose rotation changes more than a set number of degrees in one frame, then look at only the flagged frames.
- **Unverified tip:** when something twitches, triage in order: keys that flip, then easing, then overlapping tracks and priorities, then weights. Keep a known-bad clip to confirm your detector actually fires.
- **Unverified tip:** for a limb that must touch a surface, compute the reach from the shoulder to the contact point and re-aim the arm with two degrees of freedom instead of stretching it; check both per-frame drift and total drift from the intended path.
- **Unverified tip:** an R6 arm has a fixed length, so a target beyond that reach needs the body to move, not the arm. Compute the reach shell first, then place targets inside it.

Tested playback facts (easing, weights, root pose) live in the R6 playback notes.
