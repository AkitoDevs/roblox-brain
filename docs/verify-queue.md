# Verify queue

Entries tagged "(unverified)" in their title hold lines labelled "Unverified tip:". Each can be tested in Studio or checked against the official docs, then promoted (rewrite as a plain fact, set `source` to `own-testing` or `roblox-docs`, drop the label) or dropped. This file is documentation only; the build does not read it.

| Entry | Claim to check | Cheapest check |
|---|---|---|
| combat/combat-timing-and-stun-tips | Setting only Action-priority tracks to speed 0 gives a clean hit-stop with idle/movement still moving | Play two tracks, AdjustSpeed(0) on one, read TimePosition of both |
| combat/combat-timing-and-stun-tips | Stun as an end time stacks by taking the later end | Logic only; promote after a small script test |
| animation/baking-contact-tips | Un-fixed Euler flips (360 degree jumps) appear after Blender bake | Bake a spinning joint with and without the fix, compare keys |
| animation/baking-contact-tips | R6 reach shell values and the two-degree re-aim | Read Motor6D C0/C1 in one script; measure arm reach |
| animation/cutscene-camera-tips | Nine-point visibility probe beats a single centre ray | Test on a partly hidden dummy |
| vfx/vfx-layer-ownership-tips | A Beam ribbon beats a Trail on fast-turning carriers | Same carrier path, capture both |
| vfx/vfx-layer-ownership-tips | Particle tier budgets (tens / ~100 / few hundred) | Runtime stress test with several casters |
| scripting/performance-and-validation-tips | Same-value writes cost measurable time / fire signals | Loop 1,000 same-value SetAttribute with a change counter |
| scripting/performance-and-validation-tips | One shared DescendantAdded dispatcher is cheaper than many | Parent 5,000 parts with 8 listeners vs 1 |
| scripting/performance-and-validation-tips | Unreliable remote payload cap and ordering rules | Roblox docs (RemoteEvent / UnreliableRemoteEvent) |
| studio/automation-and-testing-tips | Cloned R6 changes collision groups; stuck ChangeHistory swallows writes | Clone test in Studio |
| design/launch-growth-and-hub-tips | Day-8 / weeks 2-4 weighting, gameplay-video rules, ad-goal behaviour, retention medians | Roblox Creator Hub docs and announcements (platform data, re-check before use) |
| scripting/audio-mixing-tips | SoundGroup property routes; parenting does not | Route a tone through a group with an EqualizerSoundEffect |
| ui/panel-controller-tips | Scale grid cells inside an AutomaticCanvasSize ScrollingFrame fail to settle; pixel cells fix it | Build both in a test place, add 40 items, scroll to the end in Play |
| ui/notification-stack-tips | Merged repeat notifications with an (xN) counter, cap of 4, oldest removed first, read well | Build one stack, spam one message and three others, owner watches in Play |
| ui/panel-controller-tips | Blur 14 plus HUD hiding while a panel is open; ring-opened stalls close only their own panel | One panel and one ring in a test place, walk in and out in Play |

Rule: nothing here contradicts a tested fact; anything that ever does is deleted, not labelled.
