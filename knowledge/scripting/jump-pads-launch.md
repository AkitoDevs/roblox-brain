---
title: Jump pads and launching characters
topic: scripting/jump-pads-launch
scope: generic
source: community-lesson
tags: jump pad launch pad boost bounce pad launcher fling knockback launch velocity assemblylinearvelocity linearvelocity humanoid air control freefall landed statechanged
---
# Jump pads and launching characters

**The gotcha:** setting `AssemblyLinearVelocity` on a character's root part launches it upward fine, but most of the forward push disappears within a moment. The Humanoid steers the character in the air toward the player's move input, and with no key held that input is zero, so it brakes the sideways speed.

**The fix: hold the sideways part with a constraint for the flight.**

1. Set the launch: `root.AssemblyLinearVelocity = Vector3.new(h.X, upSpeed, h.Z)`, where `h` is the horizontal launch velocity.
2. Create a `LinearVelocity` parented to the root part, with `Attachment0` set to the root's `RootAttachment`.
3. Set `VelocityConstraintMode = Enum.VelocityConstraintMode.Plane`, `PrimaryTangentAxis = Vector3.xAxis`, `SecondaryTangentAxis = Vector3.zAxis`, `RelativeTo = Enum.ActuatorRelativeTo.World` and `PlaneVelocity = Vector2.new(h.X, h.Z)`. Set `MaxForce` high (for example `math.huge`).
4. Remove it when the flight ends. Connect `Humanoid.StateChanged` and destroy the constraint (and disconnect) when the new state is `Enum.HumanoidStateType.Landed`. As a fallback, also destroy it with `task.delay` after the flight time, `2 * upSpeed / workspace.Gravity`, plus about half a second.

- **Plane mode** controls only the two horizontal axes, so gravity still shapes a natural arc.
- **Always remove the constraint.** If it's left on, the player can't steer or stop after landing.
- **Where to run it:** the client owns its character's physics, so a velocity set by the server can be overwritten. Run the launch in a LocalScript (for example on a `Touched` event filtered to the local character), or have the server tell that client to launch. Add a short cooldown per pad so one touch doesn't fire several times.
- **Anti-cheat:** if you check movement on the server, measure horizontal distance only or add an allowance for pads, so honest launches aren't flagged (see security/movement-checks).
- **Test it** in Play with no keys held and with a key held against the launch; both should land near the same spot.
