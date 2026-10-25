---
title: Anime slash geometry as a ribbon along a trajectory
topic: vfx/slash-geometry
scope: generic
source: maintainer-skill
tags: vfx slash anime crescent arc ribbon trajectory curvature catmull-rom thickness taper plane normal geometry sword
---
# Anime slash geometry as a ribbon along a trajectory

Tested by building slashes in Studio Edit mode; not yet judged in Play.

**Three separate things, never mixed**
1. **Trajectory:** where the slash exists: ordered points or a curve in a slash plane, defined in the attack's own frame (right, up, forward).
2. **Curvature:** which way it bends, measured as the signed turn about the fixed plane normal N. The convex side is the cutting edge.
3. **Animation:** a progress value p from 0 to 1 drives a visible window [tail, head] along the arc length. Never scale the whole effect uniformly, and never rotate a finished full arc into place: it reads as a spinning prop, not a cut.

**Before building, write down** the origin (at the weapon), the plane, the initial tangent, the bend, the end point, which side the cutting edge faces, and the camera it must read from. For sweeps over about 150 degrees use ordered points (Catmull-Rom); a quadratic curve can't do it. A blade-tip swing whose radius opens up along the swing (for example 4.5 to 7 studs) reads as a directional crescent; a constant radius reads as a ring.

**Ribbon construction**
- Sample the path densely (about 300 samples) and parameterise by arc length so the head advances evenly.
- At each sample: position C, tangent T, and Side = (N × T) pointing to the convex side. Edges are C + Side × width × k for each layer's offsets k.
- Keep N fixed for the whole slash: that guarantees no twist. Check that consecutive Side vectors have a positive dot product.
- Sample relative to the attack origin, never in world coordinates: far from the world origin, float precision produced dozens of fake curvature flips.
- **Silhouette:** width = W × v^a × (1 − v)^b, normalised. a greater than b puts the broad part toward the front; b near 1 gives a sharp leading point; a around 1.5 to 2.4 gives a long tapering tail. Never make both ends equally wide.
- **Thickness versus curvature (the key fix):** scale the whole cross-section by min(1, 0.35 × R / (W × bodySpan)), where R is the local radius of curvature measured over a wide window. Without it, a thick body on a tight crescent fills in toward the centre and reads as a fan. Scale every layer together.
- **Profile modes:** a static silhouette along the whole arc with a sharp revealing front, for stationary arcs and launched crescents; or a silhouette relative to the moving window, for travelling ranged slashes.
