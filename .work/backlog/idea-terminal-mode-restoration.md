---
id: idea-terminal-mode-restoration
created: 2026-08-16
updated: 2026-08-16
tags: [integration]
---

During the first live managed relaunch failure, Agent Board terminated the
remote Codex TUI after an observer conflict and returned to a shell where
Control-C emitted characters instead of behaving normally. `reset` or
`stty sane` is the immediate operator recovery. Investigate restoring the exact
pre-launch terminal mode after Agent Board-forced TUI shutdown without applying
a blanket reset that could overwrite intentional user terminal settings. This
is adjacent to `idea-observer-failure-degradation` but remains useful even if
observer failures continue to tear down the supervised TUI.
