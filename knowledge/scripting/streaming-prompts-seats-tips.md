---
title: Streaming, prompts and seats tips (unverified)
topic: scripting/streaming-prompts-seats-tips
scope: generic
source: community-lesson
tags: streaming enabled persistent model count wait proximity prompt camera seat jump change state leave
---
# Streaming, prompt and seat tips

Every line here is **Unverified tip:** material from outside reading, not tested by us.

- **Unverified tip:** with StreamingEnabled, persistent models can arrive one at a time. A client controller that lists sibling models once at startup can miss some and never hook their events. Have the server store the expected count as an attribute on the parent folder and make clients wait until that many children exist, with a timeout.
- **Unverified tip:** distant scenery built from parts (a huge sky object, a far skyline) never reaches players beyond the streaming radius. Group it in a Model with `ModelStreamingMode` set to Persistent, and confirm from the client during a playtest that it exists. Edit-mode screenshots prove nothing here.
- **Unverified tip:** a player inside a ProximityPrompt's range gets no prompt and the key does nothing when the prompt's part is outside the camera view, for example after walking backwards to it. Turning `RequiresLineOfSight` off is reported not to change this. For onboarding, turn the camera toward the next target or place targets where players already face. When a prompt seems dead, check the camera before the distance or the code.
- **Unverified tip:** setting `Humanoid.Jump` from a script may not eject a seated player, because the default control script writes that property every frame. For a custom leave-seat button, call `ChangeState` with the Jumping state, and restore any hidden default touch controls in the same step.
