---
id: feature-companion-terminal-configuration
kind: feature
stage: drafting
tags: [prose]
parent: null
depends_on: [epic-operational-readiness]
release_binding: null
gate_origin: null
created: 2026-08-15
updated: 2026-08-15
---

# Companion Terminal Configuration

## Brief

Add copyable, version-controlled examples for Andrew's Ghostty tab workflow and
Codex status line. Explain how the two surfaces divide responsibility: Agent
Board owns the registered tab title for swarm attention, while the Codex status
line shows project, branch, model/reasoning, and context usage inside the tab.

Preserve the tab creation, closure, direct navigation, prompt navigation,
working-directory inheritance, and macOS title-bar settings from Andrew's notes.
Add the Agent Board requirements for AppleScript and a fixed status-prefix-safe
bell configuration. Document that Ghostty's `prompt_tab_title` binding conflicts
with registered title ownership and that `agent-name` replaces it for supervised
tabs.

Include only minimal fragments and setup guidance. Do not copy Andrew's full
personal Ghostty or Codex files, mutate dotfiles, hard-code unrelated visual
preferences, or present the examples as automatically installed configuration.
Ground the Codex fragment in the installed `/statusline` result:

```toml
[tui]
status_line = ["project-name", "git-branch", "model-with-reasoning", "context-used"]
status_line_use_colors = true
```

## Simplification opportunity

Consolidate the scattered README setup hints and hand-off notes into one
copyable configuration directory plus a short README route. Retain
`agent-board doctor` as the verifier instead of adding an installer or a second
configuration parser.
