---
title: Ethical monetization and retention
topic: monetization/ethical-monetization-retention
scope: generic
source: maintainer-skill
tags: monetization monetize ethical fair retention onboarding first session return daily rewards streak pricing gamepass ideas loot box paid random items odds policyservice analyticsservice funnel economy sinks
---
# Ethical monetization and retention

Players who enjoy the game and feel treated fairly are the ones who come back and pay. Design the free experience first; purchases should speed up or decorate it, never gate the fun.

**First session (retention starts here)**
- Spawn straight into the world, no logo screen. The core action should be possible within 5 to 10 seconds and the first reward within about 30.
- One goal and one highlighted thing to do at a time. Teach by doing, not by text popups.
- Open a loop whose next milestone looks close (the next upgrade, the next area). If the core action isn't fun, nothing built on top of it saves the game.

**Reasons to return**
- Daily rewards that build up and never punish a missed day harshly; a streak that pauses beats one that resets to zero.
- Visible next goals, limited-time events with real new content, and social reasons (playing with friends, trading, groups).
- Every currency needs places to spend it (sinks), or prices stop mattering.

**What to sell**
- **Game passes:** permanent conveniences and cosmetics (VIP area, extra inventory slots, auto-collect, 2x currency).
- **Developer products:** consumables offered where the need is felt, such as a currency pack at the shop or a skip at the end of a long timer, not as a popup on join.
- Price by value and keep a cheap entry option. Show exactly what is bought and its effect, before and after.

**Paid random items (crates, eggs, gacha)**
- Roblox requires showing the odds before purchase. Show the full pool and each chance.
- Some players can't buy them for legal reasons. Check `PolicyService:GetPolicyInfoForPlayerAsync(player).ArePaidRandomItemsRestricted` (in pcall) and hide or replace the paid roll for them.
- Offer pity counters and a way to earn or directly buy the items too.

**Never**
- Fake or restarting countdowns, fake "only 2 left" stock, near-miss reveals designed to trigger another roll.
- Spender leaderboards, or targeting heavy spenders.
- Pay-to-win power in competitive modes, or anything that can't also be earned through play.
- Store descriptions or thumbnails that promise something the game doesn't contain.

**Measure instead of guessing.** AnalyticsService can track the first session and the economy:

	local AnalyticsService = game:GetService("AnalyticsService")
	-- once per player per step, in order
	AnalyticsService:LogOnboardingFunnelStepEvent(player, 1, "Spawned")
	AnalyticsService:LogOnboardingFunnelStepEvent(player, 2, "First Coin")
	-- after the server has changed the balance
	AnalyticsService:LogEconomyEvent(player, Enum.AnalyticsEconomyFlowType.Source,
		"Coins", 50, newBalance, Enum.AnalyticsEconomyTransactionType.Gameplay.Name)

Log after the real change succeeded, using the balance it returned. Creator Hub analytics then show where new players drop off and which sources and sinks dominate. Judge changes against your own past numbers rather than other games' figures.
