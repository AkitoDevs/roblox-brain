---
title: Finisher and ultimate shots
topic: vfx/finisher-shots
scope: generic
source: maintainer-skill
tags: vfx finisher ultimate blast beam cinematic beat sheet charge contact impact frame hitstop camera origin punch shot
---
# Finisher and ultimate shots

A big finisher fails when it is "just a beam": a beam alone is only the fire beat. Plan the whole shot first. Parts of this are from study and stills-only tests; judge the result in motion.

**1. Write the beat sheet with times:** charge (the tell), an anticipation snap, fire, contact (impact frame plus hit-stop), blast, and an aftermath hold.

**2. Layer the blast, each layer with its own size and timing:** a core flash, a fireball or dome mesh, two shock rings with different easing, streaks and sparks, debris (a crater ring, some pieces hanging before they fall), smoke, ground scorch or cracks, a light flash, directional camera shake plus a small FOV kick, an impact frame, hit-stop and layered sound.

**3. Readability:** one white-hot core; the attacker and target stay visible. Cut clutter before adding layers. Randomise size and rotation per spawn, fade fast, and let only smoke and afterglow linger.

**4. Sorting:** transparent layers sort by their centre position, so keep domes away from beam ends or use additive layers.

**Power originates from the action**
- **Write a direction sheet per shot before building:** intent, action, poses, focal point, camera, effect origin, trajectory, timing in frames, lighting, aftermath.
- **A charge lives on the limb that will strike,** never floating around the body: put every layer on one attachment at the knuckles (or weld it to the arm), drive its stages as a function of time, and assert in code that each layer stays within about 0.75 studs of that attachment.
- **Contact effects start at the measured contact point:** read the attachment's world position at the contact frame; never hard-code it.
- **Keep the contact readable:** a small flash, no more than about 2 frames per impact-frame state, and a partial 2-frame flash on the target. Release the force (ring, debris, crack line) when the hit-stop ends, along the line of force.
- **Frame the action before adding effects:** a three-quarter close-up a few studs out for the charge (not end-on), a release camera tracking just ahead of the attacker so the strike swings into the lens, and a locked low diagonal held through the hit-stop.
- **Revise one thing at a time** at matched times, keep before-and-after sheets, and reject changes that look worse.
- Native Ball and Block shells don't make wavy, layered energy outlines; flipbook flame licks locked to the limb, or a Blender shell mesh, are the next things to try.
