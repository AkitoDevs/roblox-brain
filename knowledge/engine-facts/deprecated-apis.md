---
title: Deprecated APIs and their modern replacements
topic: engine-facts/deprecated-apis
scope: generic
source: roblox-docs
tags: deprecated wait spawn delay raycast bodyvelocity loadanimation task
---
# Deprecated APIs to avoid

When generated code uses an old API, swap it for the modern one.

- wait(), spawn(), delay() -> task.wait(), task.spawn(), task.delay(). The task library is more accurate and does not throttle.
- Workspace:FindPartOnRay and its variants -> Workspace:Raycast with RaycastParams.
- BodyVelocity, BodyPosition, BodyGyro and similar legacy movers -> LinearVelocity, AlignPosition, AlignOrientation (constraint-based, with Attachments).
- Humanoid:LoadAnimation -> Animator:LoadAnimation (get the Animator from the Humanoid or AnimationController).
- Instance.new("Part", parent) with a parent argument -> create the instance, set properties, then set Parent last. This is faster and avoids replication of half-built objects.
- Old character-added patterns that assume the character exists at join -> use player.CharacterAdded and check player.Character for an existing one.
- Mouse objects from player:GetMouse() for new code -> UserInputService or ContextActionService.
- Always verify an API name against the current Roblox documentation if unsure; engine versions change.
