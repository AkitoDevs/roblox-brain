---
title: Per-frame performance and StreamingEnabled
topic: scripting/performance-streaming
scope: generic
source: maintainer-skill
tags: performance optimize optimization lag fps frame heartbeat renderstepped prerender per-frame allocation bulkmoveto streamingenabled streaming modelstreamingmode persistent atomic requeststreamaroundasync microprofiler mobile
---
# Per-frame performance and StreamingEnabled

**Per-frame code.** Anything connected to `RunService.Heartbeat` (or `PreRender` for camera and visuals) runs 60 or more times a second, so small costs multiply.
- One loop for many objects, not one connection per coin, door or NPC. Keep the objects in an array and iterate it.
- Cache references. No `FindFirstChild`, `GetDescendants` or `GetChildren` inside the loop; look them up once and update the cache on `ChildAdded` and `ChildRemoved`.
- Don't allocate per frame. Creating tables and closures every frame feeds the garbage collector; reuse a table with `table.clear`.

Throttle work that doesn't need every frame (AI decisions, distance checks, UI text):

	local RunService = game:GetService("RunService")
	local acc = 0
	RunService.Heartbeat:Connect(function(dt)
		acc += dt
		if acc < 0.2 then return end -- 5 times a second
		acc = 0
		updateNearbyThings()
	end)

**More savings**
- Moving many anchored parts: build arrays of parts and CFrames and call `workspace:BulkMoveTo(parts, cframes, Enum.BulkMoveMode.FireCFrameChanged)` once, instead of setting each part's CFrame.
- Spinning coins, floating pickups and flicker are cosmetic: run them on each client, skip ones far from the camera, and never animate decor from the server (that sends every change over the network).
- Static parts: anchored, and `CanCollide`, `CanTouch` and `CanQuery` off for pure decoration.
- Use `task.wait()` and `task.spawn`; the old `wait` and `spawn` are deprecated.

Measure before and after with the MicroProfiler (Ctrl+F6 in a running game) and the Developer Console (F9), and test on a phone; desktop Studio hides most problems.

**StreamingEnabled.** New places have `Workspace.StreamingEnabled` on: the client only receives the parts near the player. This saves memory and join time, but client code must expect missing parts.
- A far-away part can be nil on the client, and streamed-out instances are parented to nil. Use `WaitForChild` with a timeout, or react to `ChildAdded` and CollectionService `GetInstanceAddedSignal`, instead of assuming the object exists.
- The server always has everything; streaming only affects clients.
- `Model.ModelStreamingMode`: **Atomic** sends a model's parts together (use for anything a client script reads as a whole); **Persistent** is sent once after joining and never streams out (use sparingly, for things like the lobby's main signs); `Workspace.PersistentLoaded` fires when persistent models have arrived.
- `StreamingMinRadius` (default 64) always stays loaded; `StreamingTargetRadius` (default 1024) is the farthest it streams in.
- Before moving a player far across the map from the server, call `player:RequestStreamAroundAsync(targetPosition)` so the area is there when they land.
- `StreamingIntegrityMode = PauseOutsideLoadedArea` pauses a player rather than letting them fall through unloaded ground; `StreamOutBehavior = Opportunistic` frees memory sooner.
