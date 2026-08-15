---
id: feature-hotkey-project-rename
kind: feature
stage: drafting
tags: [cli, integration, ui]
parent: null
depends_on: [feature-companion-terminal-configuration]
release_binding: null
gate_origin: null
created: 2026-08-15
updated: 2026-08-15
---

# Hotkey Project Rename

## Brief

Restore the convenience of Andrew's former Ghostty `⌘⇧R` rename workflow
without surrendering Agent Board's ownership of registered tab titles. Running
`agent-name` with no label captures the currently focused registered Ghostty
session, presents a native macOS rename prompt prefilled with its current project
label, updates only that label, and re-renders the canonical `<status> <label>`
title. The existing `agent-name <label>` registration and scripting path remains
unchanged.

Document a macOS Shortcut that invokes the installed command by absolute path and
binds it to `⌘⇧R`. The Ghostty config must leave that chord unbound so the
system shortcut receives it. Cancellation is a successful no-op; invalid labels,
missing registration, changed terminal identity, AppleScript failure, and title
reconciliation failure remain visible errors.

The native dialog is a deliberately trivial operating-system surface: one text
field, Cancel, and Rename. It follows the standard macOS interaction rather than
introducing a custom visual language, so an HTML screen mock would not resolve a
meaningful product choice.

## Simplification opportunity

Extend the existing `agent-name` command and reuse the current session store,
focused-terminal resolver, label validation, and title renderer. Do not add a
second rename command, inject text into Ghostty, restore Ghostty's manual title
override, or introduce a resident helper process.
