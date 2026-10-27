---
title: Wind sway for many anchored mesh trees
topic: vfx/foliage-wind-sway
scope: generic
source: community-lesson
tags: foliage trees wind sway globalwind bulkmoveto client streaming collectionservice ambient motion performance untested
---
# Wind sway for many anchored mesh trees

**Status: reported by one developer, not tested here.** Treat it as a starting recipe and measure it in your own place.

A way to make lots of anchored, unrigged mesh trees sway on the client without re-uploading meshes:
- **Tag the tree models** and pick them up on the client with CollectionService (added and removed signals), so trees that stream in or out are handled.
- **Cache each part's offset from the model pivot once**, when the tree first appears. Every frame, rebuild the CFrame from that cached rest pose. Never read back a part you already moved, or the error builds up and the tree drifts.
- **Two pivots.** Tilt the trunk a little about its ground pivot, and the crown a bit more about a point just under the crown. Leaf cards can get an extra small, fast flutter. Use the wind direction (for example Workspace.GlobalWind) as the tilt axis and a slow sine with a per-tree phase offset so trees don't move in lockstep.
- **Budget it.** Only animate trees near the camera, update far ones every few frames, and leave the rest still.
- **One move call per frame.** Gather every new CFrame and apply them together with WorldRoot:BulkMoveTo, rather than setting CFrame part by part.
- It's cosmetic, so run it on the client only. The server keeps the trees still.

Check: walk past the forest and watch the micro-profiler or frame time before and after. Make sure trees that stream back in sway from their true rest pose.
