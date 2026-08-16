---
id: story-fix-hotkey-rename-routing
kind: story
stage: review
tags: [bug, cli, integration]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Route the rename hotkey through Agent Board

## Symptom

Pressing `⌘⇧R` in a managed Ghostty tab opened a rename prompt and visibly set
a plain tab title, but the next Agent Board status transition restored the
status glyph plus the old folder-derived label.

## Reproduction evidence

- The affected session records retained their original `projectLabel`, proving
  the no-argument `agent-name` persistence path did not run.
- Ghostty's live Accessibility menu metadata reported `⌘⇧R` on its native
  **Change Tab Title...** item.
- The **Rename Agent Tab** Service was present but reported no keyboard
  equivalent.
- Ghostty's installed documentation says `prompt_tab_title` creates a persistent
  manual override and that macOS menu bindings run before remapped input.

## Root cause

The shipped companion config told operators to leave `⌘⇧R` unbound, but Ghostty
1.3 supplies its native title action on that chord by default. The native menu
action therefore won before the Agent Board Service and changed only Ghostty's
manual title override, not Agent Board's stored project label.

## Fix approach

Explicitly unbind Ghostty's default `⌘⇧R` action in the companion config, retain
the macOS Service as the Agent Board owner, and document a verification that the
Service displays the assigned chord before testing a managed rename.

## Regression test

Validate the shipped Ghostty config as a product artifact: it must explicitly
unbind `cmd+shift+r` and must not bind that chord to `prompt_tab_title`.

## Acceptance

- The example Ghostty config explicitly removes the native `⌘⇧R` binding.
- Setup instructions explain why omission is insufficient on macOS.
- The verification path distinguishes the Agent Board prompt/canonical title
  from Ghostty's plain manual title override.
- Focused tests, typecheck, and config validation pass.

## Implementation notes

- Corrected the shipped companion config to explicitly remove Ghostty's native
  `cmd+shift+r` binding before the macOS Service claims the chord.
- Updated the setup guide and README with the native-menu collision, Service
  ownership check, and the visible distinction between Agent Board's canonical
  glyph title and Ghostty's plain manual override.
- Added `tests/integrations/ghostty/configuration.test.ts`, which failed against
  the old omission and now protects the exact unbind contract.
- No application code changed: the no-argument `agent-name` persistence and
  title-rendering path was already correct; the defect was in delivered
  integration configuration.

## Verification

- Focused pre-fix regression: failed with no `cmd+shift+r` action in the shipped
  config; post-fix regression passes.
- `ghostty +validate-config --config-file=examples/ghostty/agent-board.conf`
  exits zero.
- `npm run typecheck` passes.
- Full `npm test`: 193 passed, 2 opt-in integration probes skipped, 0 failed.
- `git diff --check` passes.
