---
title: Studio gotchas and how to inspect results
topic: studio/gotchas-inspection
scope: generic
source: maintainer-skill
tags: studio gotcha geometryservice splitapart editablemesh pivot primarypart meshid terrain raycast capture screenshot surfacegui inspection overlap verify
---
# Studio gotchas and how to inspect results

**Gotchas (each one cost a retry)**
- GeometryService's SplitApart option defaults to true: pass false, or the first result is only one piece. Split and fragment pieces report the source centre as their Position.
- CSG collision hulls give one-sided overlap results and fill sockets: use a mutual check plus exact rays, and PreciseConvexDecomposition where sockets matter.
- EditableMesh: a face is visible from the side its (b − a) × (c − a) normal points to; a MeshPart made from one is re-centred on its bounding box; after a re-mesh, re-derive the pivot from a part, because a stored WorldPivot goes stale.
- Terrain written in one call isn't raycastable until a later call.
- A KeyframeSequence id from RegisterKeyframeSequence must be used exactly as returned; adding a prefix gave a zero-length track.
- PrimaryPart overrides WorldPivot: set PrimaryPart.PivotOffset = PrimaryPart.CFrame:Inverse() × cornerCFrame to pivot at a corner.
- MeshId can't be set by script after creation: make a new MeshPart.
- Rewriting an EditableImage updates a SurfaceAppearance live, but not a Decal: assign a new image to the Decal.
- Local lights can stall in captures; toggling LightingStyle in separate calls refreshed them.
- A SurfaceGui is blank in the first capture after it is created: capture again.
- A test ScreenGui left in StarterGui shows in every capture and in everyone's view: delete it.
- The editor camera may be left Scriptable after tool calls; set it back for the person using Studio.

**What edit-mode screenshots can't show:** ParticleEmitter, Fire, Trail, DepthOfField and a ViewportFrame inside a SurfaceGui don't render there. Build them, mark them "not judged in motion" and view them in Play. Sound can be measured (AudioAnalyzer) but not judged by a tool.

**Checks that work**
- Openings and collision: a raycast with an Include filter on the model.
- Overlaps: clone each part with its size inset by about 0.04, then GetPartsInPart. Report zero before showing anything.
- Kit alignment: read each piece's top from GetBoundingBox.
- Physics: one short Play run, then read the values on the server side (hinge angle, distances, height drift).
- Scripts: have the script write its results as attributes on itself, then read them.
- Looks: capture before and after from the same camera, one change per capture.
- Tweens and Heartbeat run in Edit, so effects can be captured mid-motion, but stills never prove motion.
