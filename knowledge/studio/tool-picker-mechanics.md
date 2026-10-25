---
title: Picking the right Studio tool for mechanics and motion
topic: studio/tool-picker-mechanics
scope: generic
source: maintainer-skill
tags: studio hingeconstraint ropeconstraint springconstraint vectorforce alignposition collision groups collectionservice debris ikcontrol bones pathfinding actors parallel audio reverb
---
# Picking the right Studio tool for mechanics and motion

Each choice below was tested in Studio.

- **Doors and gates:** HingeConstraint in Servo mode (the attachment's X axis is the hinge axis), not a scripted CFrame spin.
- **Hanging signs and lanterns:** RopeConstraint or SpringConstraint. For a spring, stiffness k = mass × gravity / sag gives the intended rest length.
- **Hover and float:** a world-space VectorForce of mass × gravity, or AlignPosition. Avoid legacy body movers.
- **Objects that pass through each other:** collision groups, not CanCollide toggling everywhere.
- **Many animated props:** one RunService loop over CollectionService:GetTagged(tag), with settings stored in attributes. It also picks up props tagged later. Not one script per prop.
- **Timed cleanup:** Debris:AddItem rather than chains of task.delay and Destroy.
- **Sync hit, sound and VFX to an animation:** a KeyframeMarker and GetMarkerReachedSignal triggering an OverlapParams hitbox, beam, light, particles and sound, with Debris cleanup. Not timed waits.
- **Hand on a grip point:** IKControl in Position mode with the target inside the chain's reach (out-of-reach targets leave a large error).
- **Bending a tail or tentacle:** EditableMesh bones set with SetVertexBones and SetVertexBoneWeights, plus matching Bone instances, which are not created for you; animate Bone.Transform.
- **Steering NPC paths:** PathfindingModifier labels with costs to avoid areas, and PathfindingLink to cross gaps, instead of invisible walls.
- **Heavy independent loops:** Actors with BindToMessageParallel, calling task.synchronize() before writing to the DataModel. This ran about 2.6 times faster than one serial loop.
- **Local post effects:** Blur or ColorCorrection parented to the Camera, rather than changing shared Lighting.
- **Sound with room character:** AudioPlayer to AudioReverb to AudioEmitter, connected with Wires.
- **Item preview in UI:** a ViewportFrame in a ScreenGui (one inside a SurfaceGui drew nothing in Edit). Animated rigs need a WorldModel; fit the camera to the bounding sphere.
- **A build-checking tool:** run the validator and auto-fix in one call acting on the Selection, so one undo restores everything.
