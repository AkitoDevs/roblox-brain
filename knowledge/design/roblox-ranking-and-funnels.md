---
title: Roblox ranking signals, audience and funnel logging
topic: design/roblox-ranking-and-funnels
scope: generic
source: maintainer-skill
tags: discovery ranking retention bounce play days funnel analytics audience age seasonal obby onboarding
---
# Roblox ranking signals, audience and funnel logging

- **What Roblox measures.** The recommender weighs play-through rate, first-play bounce (under 60 seconds and 61 to 180 seconds), play days per user (day 1, days 2 to 7, days 8 to 28) and playtime per user, counted up to 60 minutes per user per game per day. Only organic Home arrivals count. A custom thumbnail is required for Home impressions, and titles and thumbnails must match gameplay.
- **Consequences for a short-loop game.** The first minutes are the retention hook: the first stages must stop early bounces, and a finished course needs a reason to return (new zones, events, leaderboards). Reach the fun in about five minutes or less.
- **Audience.** In the Q3 2026 shareholder letter, age-checked users were 34 percent under 13, 37 percent 13 to 17 and 29 percent 18 and over (64 percent of daily users were age-checked). Older "ages 9 to 17" and "80 percent mobile" claims are not current Roblox statistics; date any mobile share you quote. Keep text and UI simple.
- **Seasonality.** Q4 daily users are seasonally lower than Q3 and bookings concentrate in the last week of December, so do not plan on growth from the season alone. Home traffic peaks on Saturdays; time updates for a weekend. Small updates every 2 to 4 weeks and large ones every 2 to 3 months is Roblox's own advice.
- **Funnel logging.** Log the stage or zone reached with the onboarding funnel step event (server-side, published games only, up to 100 steps per funnel, 10 funnels) to find the drop-off stage. Expect the biggest loss at the first interaction; log more than checkpoints. Skipped steps count as completed.
- **Unverified.** Retention benchmark tables, winter lift percentages and a "first 10 to 25 days" promotion window have no primary source; treat them as direction only.
