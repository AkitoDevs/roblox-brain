# Roblox Brain: privacy and sharing

Roblox Brain is a Claude Code plugin with built-in Roblox knowledge. It also shares short tips with the maintainer so the knowledge can get better for everyone. This page explains exactly what that means.

## What is shared

Sharing is **on by default**. The first time you use Roblox Brain in a project, Claude shows you a short notice about it. Nothing is shared in that project before the notice has been shown.

After a task, if something generally useful came up (a non-obvious bug, a fix that took a few tries, a gotcha), Roblox Brain may share **one brief note** with the maintainer. A note contains only:

- the **topic** (for example `ui/scaling`)
- the **problem**, in general terms (up to 300 characters)
- the **fix**, in general terms (up to 400 characters)
- any **Roblox API names** involved (for example `CanvasGroup`)
- an optional result (for example "ran clean") and Roblox engine version

The maintainer's server stores each note with:

- a **random install id**: a code made up on your computer when the plugin first ran, not linked to your Roblox, GitHub, Claude or any other account. It's what lets you delete your notes later.
- the **date** (no time of day).

**Nothing else is collected.** No IP address is stored (the server turns the connection address into an unreadable code only to limit floods, and doesn't save it), no logs are kept, and there are no accounts, cookies or analytics.

## What Roblox Brain is designed to leave out

Notes are designed to leave out your code, names, ids, links and emails, and they're **filtered automatically** before anything leaves your computer, and again on the server. A note is dropped instead of shared if it contains, for example: code or code-like text, quoted text, file names or paths, links or web addresses, emails, numbers that could be ids, "called ..." or "my game ..." style mentions, your project's folder name, your computer's user name or network name, or terms on the maintainer's private blocklist. The filters are strict on purpose: when something looks borderline, it isn't shared. No filter is perfect, which is why you can see and delete everything (below).

## See what has been shared

Everything Roblox Brain shares from your computer is also written to your **sharing history**, a plain text file you can open at any time:

- Windows: `C:\Users\<you>\.roblox-brain\sent-lessons.md`
- macOS and Linux: `~/.roblox-brain/sent-lessons.md`

You can also say **"show my shared tips"** in Claude Code.

## Turn sharing off or on

Say **"turn off Roblox Brain sharing"** in Claude Code. It turns sharing off for every project on your computer until you say **"turn on Roblox Brain sharing"**. While sharing is off, nothing is shared and no notice is shown. The setting is stored in `~/.roblox-brain/config.json` (`"share": false`).

## Delete what you've shared

Say **"delete my shared tips"**. This deletes every note from your install on the maintainer's server, and nothing else. Copies the maintainer has already downloaded for review are deleted at their next review. Your install then gets a new random id, so future notes aren't linked to the deleted ones. Your local sharing history keeps its list for your own reference; you can delete that file yourself.

Important: the random install id in `~/.roblox-brain/config.json` is the only proof that notes are yours. If you reinstall in a way that removes that folder, or clear the config, you can no longer delete notes shared before that. To delete them, run "delete my shared tips" **before** removing the plugin or that folder.

## How long notes are kept

- Notes are taken off the server as soon as the maintainer downloads them for review (normally weekly).
- Anything not reviewed within **90 days** is deleted from the server automatically (a daily cleanup).
- The maintainer's raw review copies are deleted after 90 days as well.
- If the maintainer approves a note, they rewrite the idea in their own words into the shared knowledge. That rewritten text contains no install id and isn't linked to you. Nothing you share goes into the knowledge without the maintainer's approval.

## If this project is discontinued

- The server tells the plugin when the sharing service has ended, and the plugin then **turns sharing off automatically** and tells you once. If the server simply disappears, the plugin also turns sharing off on its own after repeated failures on several different days.
- The **knowledge in the plugin keeps working offline**: it ships inside the plugin and doesn't need the server.
- Previously shared tips can be deleted by the maintainer at any time, and they are removed when the service is closed.

## Questions

Open an issue on this project's GitHub repository. Please don't post anything personal in an issue.
