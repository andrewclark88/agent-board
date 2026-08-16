---
id: idea-refuse-detached-focus-rename
created: 2026-08-16
updated: 2026-08-16
tags: [cli, integration]
---

An agent-tool invocation of `agent-name <label>` has no reliable originating
Ghostty terminal, yet the current focus-based command can register or rename
whichever tab is frontmost when the tool eventually executes. Andrew observed
this rename the wrong open tab. Preserve direct shell and Codex `!` usage plus
the no-argument macOS Shortcut, while considering a refusal or explicit-target
requirement for detached/noninteractive label invocations.
