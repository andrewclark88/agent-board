---
id: feature-automatic-missing-session-cleanup
kind: feature
stage: drafting
tags: [state, cli, integration]
parent: null
depends_on: [epic-ghostty-project-surface-title-reconciliation, epic-swarm-attention-board-board-command]
release_binding: null
gate_origin: null
created: 2026-08-15
updated: 2026-08-15
---

# Automatic Missing Session Cleanup

## Brief

Make ordinary Ghostty tab closure a complete Agent Board retirement workflow.
During an `agents` board refresh, retain registered terminals that are visible,
hidden/undoable, or unknown because inspection failed, but automatically remove
a session once the authoritative Ghostty snapshot reports its terminal as
missing from the application-wide terminal collection.

Ghostty's hidden/enumerable state is the grace period: closing and undoing a tab
must preserve the session and its title, while a terminal that Ghostty has fully
released no longer needs a diagnostic tombstone. The board should omit a pruned
session in the same invocation. If removal fails, retain and display the missing
diagnostic so cleanup is retryable rather than silently claimed.

Keep `agent-board unregister` for deliberately releasing a still-open or hidden
tab, troubleshooting, and uninstall workflows. Remove it from the normal `⌘W`
path and do not add a daemon, timer, schema field, cleanup command, or user
configuration.

## Simplification opportunity

Use the existing one-snapshot `agents` reconciliation and Ghostty
`visible | hidden | missing | unknown` classification as the complete cleanup
policy. This makes a separate time-based tombstone model and routine manual
unregister step unnecessary.
