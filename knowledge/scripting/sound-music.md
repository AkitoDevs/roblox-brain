---
title: Sound effects and music
topic: scripting/sound-music
scope: generic
source: maintainer-skill
tags: sound sounds sfx music audio playlist soundgroup soundservice volume 3d spatial rolloff rolloffmaxdistance playlocalsound preload contentprovider fade background music audioplayer
---
# Sound effects and music

**2D or 3D is decided by the parent.** A Sound inside a BasePart or Attachment in Workspace plays from that spot and gets quieter with distance. A Sound anywhere else (SoundService, a ScreenGui, a folder) plays at the same volume for everyone who hears it. `Volume` defaults to 0.5 and goes up to 10.

**3D world sounds.** The default `RollOffMaxDistance` is 10,000 studs, so a waterfall can be heard across the whole map. Set it on purpose:
- `RollOffMode = InverseTapered` for natural falloff that still reaches zero.
- `RollOffMinDistance` (full volume inside it) around 5 to 10, `RollOffMaxDistance` around 60 to 150 for most props.

**Where to play.** Feedback (clicks, hits, pickups, UI) plays on the client so it is instant; server-played sounds reach everyone but arrive late.
For a simple client one-shot, use `SoundService:PlayLocalSound(sound)`. For a one-shot at a position on the client:

	local function playAt(template: Sound, position: Vector3)
		local holder = Instance.new("Attachment")
		holder.WorldPosition = position
		holder.Parent = workspace.Terrain
		local s = template:Clone()
		s.Parent = holder
		s.Ended:Once(function() holder:Destroy() end)
		s:Play()
	end

**Volume groups.** Make SoundGroups in SoundService (Music, SFX, Ambience) and set each Sound's `SoundGroup`. A settings slider then sets the group's `Volume` on that client only. Group volume scales sounds without changing their own `Volume`.

**Music playlist (LocalScript).** Keep tracks in a folder in SoundService (contents replicate), each set to the Music group:

	local ContentProvider = game:GetService("ContentProvider")
	local SoundService = game:GetService("SoundService")
	local tracks = SoundService:WaitForChild("Playlist"):GetChildren()
	ContentProvider:PreloadAsync(tracks) -- waits until they loaded or failed

	local i = 0
	while true do
		i = i % #tracks + 1
		local s = tracks[i] :: Sound
		if s.IsLoaded then
			s:Play()
			s.Ended:Wait()
		else
			task.wait(1) -- skip a track that failed to load
		end
	end

**Fades.** Tween `Volume` with TweenService instead of stopping abruptly; crossfade zone themes when the player enters a region.

**Facts that cause "my sound doesn't play"**
- The audio asset must be usable by the experience: uploaded by its owner (the user or group that owns the experience), shared with it, or public. Otherwise the Output shows a load failure and nothing plays.
- `Loaded` fires only once; check `IsLoaded` first. `Ended` doesn't fire for looped sounds or when stopped early.
- `Looped` sounds must be stopped or destroyed when their source goes away.
- A Sound under a part that is far away or streamed out on that client is silent there; keep music and UI sounds outside Workspace.

The newer audio API (AudioPlayer wired to AudioEmitter or AudioDeviceOutput through Wire instances) adds effects and routing; classic Sound objects remain fully supported for most games.
