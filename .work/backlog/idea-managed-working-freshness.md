---
id: idea-managed-working-freshness
created: 2026-08-16
updated: 2026-08-16
tags: [state, integration]
---

A healthy managed Codex turn can remain active longer than the default
60-second `workingFreshForMs` without emitting another lifecycle transition.
When `agents` reconciles titles during that interval, projection demotes the
authoritative `working` record to `?` as stale even though the launcher and
observer remain healthy; the next completion event restores `✓`. Andrew observed
this live while another tab received Ctrl-C, but the timing coincided with an
Agent Board reconciliation. Revisit freshness so long-running managed activity
stays truthful while genuinely abandoned working state still degrades safely.
