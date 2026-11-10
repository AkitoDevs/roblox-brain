---
title: Custom skyboxes at night (unverified)
topic: lighting/custom-skybox-at-night
scope: generic
source: community-lesson
tags: sky skybox night clocktime brightness black stars moon sun texture dusk free model safety unverified
---
# Custom skyboxes at night

Labelled **Unverified tip:** community reports, not checked against docs or by us.

- **Unverified tip:** a custom night skybox can render near black because the engine dims skies while the sun is below the horizon, so painted stars never show.
- **Unverified tip:** keep an early-evening ClockTime (around 18) with low Brightness and a cool colour shift, so the sky stays visible and the scene still reads as dusk.
- **Unverified tip:** use the moon image as the sun texture, and swap skies at the moment dusk has already faded the old sky to black so the change is invisible.
- **Safety (important):** free sky models can hide scripts or GUI inside child objects, such as a post-effect child. Insert them into ServerStorage first and count their descendants. Keep only a Sky with zero children and six distinct face textures, and destroy everything else before parenting it to Lighting.