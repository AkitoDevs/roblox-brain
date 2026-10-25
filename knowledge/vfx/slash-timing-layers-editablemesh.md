---
title: Slash timelines, layers and EditableMesh
topic: vfx/slash-runtime
scope: generic
source: maintainer-skill
tags: vfx slash easing timeline layers editablemesh assetservice createmeshpartasync transparency chunks visual test camera edge-on
---
# Slash timelines, layers and EditableMesh

Verified in Studio Edit mode only; Play and published-game behaviour still need testing.

**Timelines (each slash type its own easing, width, speed and lifetime)**
- **Reveal** (stationary arcs, diagonals, hooks): the head eases from 0 to 1; the tail follows at max(head âˆ’ maxLength, an eased tail curve).
- **Travel** (ranged slash): the same with the silhouette relative to a short window (about 0.3 of the arc).
- **Launch** (crescent projectile): reveal along the swing, then translate the formed crescent along the launch direction while it erodes from the weapon-side tip.
- Starting easings: quick cut Expo Out around 0.45 s; heavy, a slow build then sudden release around 0.75 s; ranged Quad Out around 1.1 s; hook Cubic InOut around 0.7 s.
- The outer haze lags the edge by 0.01 to 0.08 of progress. Play to p = 1.15 so lagged layers finish.

**Layers, all reinforcing the same curve:** a narrow white-hot cutting edge on the convex rim with a shorter window; the energy body; a low-opacity outer haze that must never become an opaque crescent hiding the character; two thin offset streaks with lag; sparks born as the head passes, flying along the tangent toward the convex side. Colour ramps along the window (tail deep, body main, head hot) with a darker inner edge.

**Building it at runtime with EditableMesh**
- Create the mesh with AssetService:CreateMeshPartAsync from an EditableMesh; live vertex position updates move the MeshPart.
- Add one degenerate triangle with vertices at plus and minus the maximum radius so the bounds stay fixed and the part never re-centres.
- Vertex-colour alpha does not give transparency (alpha 0 renders white). Fade with part Transparency instead by splitting each layer into about 6 chunk MeshParts along the ribbon; chunk seams can show as small steps.
- Add both triangle windings so the ribbon shows from both sides.
- In Play and published games the Mesh and Image APIs must be allowed in Game Settings (Security), and the client EditableMesh memory budget has been seen to fail after only a few meshes. For shipped effects, prefer imported MeshParts or baked flipbooks; keep runtime generation for authoring and testing.
- In Edit-mode captures, ParticleEmitters don't render: use small Neon parts as stand-in sparks.
