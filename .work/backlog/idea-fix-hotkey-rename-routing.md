---
id: idea-fix-hotkey-rename-routing
created: 2026-08-16
updated: 2026-08-16
tags: [cli, integration]
---

The configured macOS `⌘⇧R` rename path appeared to replace the complete Ghostty
title with a plain label while leaving Agent Board's stored `projectLabel`
unchanged; the next managed status transition then restored the glyph plus the
old folder-derived label. Effective Ghostty config no longer exposes a
`prompt_tab_title` binding, and macOS registers `Rename Agent Tab` as a Service
on `⌘⇧R`, so reproduce which action actually owns the chord and verify the
Shortcut runs the no-argument `/opt/homebrew/bin/agent-name` persisted rename
path against the captured focused tab.
