---
title: R6 combat animation standard
topic: animation/r6-combat
scope: generic
source: maintainer-skill
tags: animation r6 combat roll dodge slash attack key poses anticipation follow-through timing silhouette blender motor6d review
---
# R6 combat animation standard

**R6 limits.** Only the classic six parts and their Motor6D joints (RootJoint, Neck, both Shoulders, both Hips). No elbows, knees, spine or finger bones. Create the illusion of mechanics through torso, shoulder, hip and head rotation, limb placement and asymmetric poses. Never assume an ordinary Blender armature exports as a working R6 animation: verify the rig and the import pipeline first.

**Phase thinking (example: evasive roll into a rising slash, about 1.4 to 1.8 s at 30 FPS)**
1. Combat stance: low, alert, weight biased toward the leg that starts the move. Never an upright, stiff idle.
2. Initiation: compress and push off; torso pitches into the direction of travel; limbs tuck; the weapon stays away from the body and floor. Never rotate the whole character around its centre like a spinning prop.
3. Main action: distinct poses for inversion, the compact middle, the lowest point and completion, with limbs following the torso's momentum and no sudden direction reversals.
4. Recovery: legs reposition for a believable landing, the torso counter-rotates, the head finds the target, and the recovery flows straight into the next anticipation. No snapping upright.
5. Attack anticipation: short and purposeful, with visible travel distance ahead of the weapon.
6. Attack: shoulders, torso and legs all contribute; a strong pose at full extension; the weapon stays aligned with the hand throughout.
7. Follow-through: the weapon decelerates rather than stopping dead; end in a balanced pose that idle or locomotion can blend into.

**Quality standards**
- Uneven spacing: fast acceleration into launches and strikes, controlled spacing in anticipation and recovery. The strike is faster than the recovery.
- Overlap: weapon, arm, torso and legs do not all stop on the same frame without reason.
- Weight: compress before launching, establish balance in recovery, use the torso in attacks.
- Silhouette: every key pose reads on a plain background; never hide the weapon behind the torso on attack frames.
- Pose contrast: stance, action, impact and final pose look clearly different.
- Inspect interpolation for overshoot, drift and foot sliding instead of trusting auto-smoothing.

**Root motion:** don't assume body translation in Blender reaches Roblox. Animate the body rotation and poses, and move the HumanoidRootPart with gameplay code where needed.

**Review** at normal speed and slowed down, from a front three-quarter view, a side view and the gameplay camera: does it read as the move? Is the weapon under control on a deliberate arc? Does the attack feel powerful rather than an arm wave? Any pops? Balanced finish? Reproducible with standard R6 joints? Judge it moving in the actual game, and show short in-game clips early instead of polishing in Blender.
