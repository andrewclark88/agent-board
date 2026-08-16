---
name: agent-board-companion-configuration
description: Read this when configuring Ghostty tabs and the Codex status line for the recommended Agent Board workflow.
type: design
kind: planning
status: locked
nav_priority: high
updated: 2026-08-16
summary: |
  Agent Board owns the compact Ghostty tab title, while Codex owns the detailed in-tab status line. Minimal merge-only examples preserve Andrew's tab and prompt-navigation workflow without copying or mutating full personal configuration files.
decisions:
  - Agent Board owns the complete title of each registered Ghostty tab.
  - The Codex status line shows project, branch, model/reasoning, and context usage inside the active tab.
  - Copyable examples are merged manually and never overwrite a complete personal configuration.
  - The Ghostty manual-title prompt is not used for supervised tabs because it conflicts with machine title ownership.
---

# Companion terminal configuration

Agent Board and Codex answer different questions:

```text
Ghostty tab title     ● data-platform
                      Which agent needs attention?

Codex status line     data-platform / feature/foo / gpt-5.6-sol medium / Context 23% used
                      What environment is active inside this tab?
```

Keep both surfaces. Agent Board owns the registered tab title. Codex owns the
detailed status line inside the terminal.

## Configure Ghostty

The copyable merge fragment is
[`examples/ghostty/agent-board.conf`](../examples/ghostty/agent-board.conf).

Merge that fragment into your active Ghostty configuration. Andrew's current
tab-workflow file is:

```text
~/.config/ghostty/config.ghostty
```

Edit it with:

```bash
nano ~/.config/ghostty/config.ghostty
```

In `nano`, use these keys:

```text
Ctrl+O    save
Enter     confirm filename
Ctrl+X    exit
```

If your Ghostty installation uses `~/.config/ghostty/config`, merge the fragment
there instead. Do not replace unrelated font, theme, padding, or scrollback
settings.

The fragment provides this workflow:

```text
⌘T       new project tab
⌘W       close the current surface
⌘1–9     jump directly to a project tab
⌘↑       jump to the previous shell or agent prompt
⌘↓       jump forward toward the current prompt
```

New tabs and splits inherit the current working directory. Ghostty displays tabs
in the macOS title bar.

### Title ownership and rename shortcut

Do not bind `cmd+shift+r` to Ghostty's `prompt_tab_title` for registered Agent
Board tabs. A manual Ghostty title override competes with Agent Board's
machine-rendered `<status> <project>` title. Leave that Ghostty chord unbound so
the macOS Shortcut can receive it; Ghostty app keybinds would intercept the
keystroke first.

For a direct rename, pass one label from a shell prompt:

```bash
agent-name data-platform
```

For a native macOS rename prompt, run `agent-name` with no label:

```bash
agent-name
```

Agent Board captures the focused registered Ghostty session before opening the
dialog. Rename changes only the stored project label and canonical title; it
does not change session identity, agent state, or terminal binding. Cancel is a
silent successful no-op. Passing more than one label prints:

```text
Usage: agent-name [label]
```

To bind the no-argument prompt to `⌘⇧R`, use a macOS Shortcut with a **Run
Shell Script** action. For the Homebrew installation, set the shell to
`/bin/zsh`, leave **Run as Administrator** off, and use:

```bash
export PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
exec /opt/homebrew/bin/agent-name
```

The Shortcut Input setting may remain at its default; passing input to stdin is
fine. If `agent-name` is installed elsewhere, replace the executable path with
the path from `command -v agent-name` and include its containing `bin`
directory in `PATH`. This is required because the linked executable invokes
Node through `/usr/bin/env`.

In **Shortcut Details**, enable **Services Menu**. Then open **System Settings
→ Keyboard → Keyboard Shortcuts → Services**, find **Rename Agent Tab**, enable
it, and assign `⌘⇧R`. The Shortcuts editor's **Add Keyboard Shortcut** can
intercept that chord as Repeat, so treat it as an optional first attempt rather
than the preferred method. Shortcuts saves automatically.

Under Shortcuts **Advanced**, only **Allow Running Scripts** is required; do
not enable large-data or deletion permissions. The first invocation may show a
separate macOS Automation permission prompt; grant it to let the
Shortcut-launched command inspect and retitle Ghostty.

The direct shell command remains available when the Shortcut is inconvenient.
Agent Board then retains the label while status changes update only the leading
glyph.

### Required integration values

Ghostty AppleScript must remain enabled:

```text
macos-applescript = true
```

The status glyph must remain the first title character. The example starts from
Ghostty 1.3's bell defaults and replaces title decoration with `no-title`:

```text
bell-features = no-system,no-audio,attention,no-title,no-border
```

Preserve any different bell choices you prefer, but keep `no-title` and omit
`title`.

## Configure the Codex status line

The copyable merge fragment is
[`examples/codex/status-line.toml`](../examples/codex/status-line.toml).

The safest setup path uses Codex itself:

1. Start Codex.
2. Enter `/statusline`.
3. Select these fields in order:

   ```text
   project-name
   git-branch
   model-with-reasoning
   context-used
   ```

4. Enable status-line colors if desired.

The tested Codex 0.147.x setup writes this configuration:

```toml
[tui]
status_line = ["project-name", "git-branch", "model-with-reasoning", "context-used"]
status_line_use_colors = true
```

If you edit `~/.codex/config.toml` manually, merge these keys into its existing
`[tui]` table. TOML does not permit duplicate table declarations.

## Verify the setup

Restart Ghostty after changing its configuration. Then open a project tab and
run:

```bash
agent-board doctor
agent-name agent-board
agent-codex
```

Confirm these results:

- The tab starts with one Agent Board status glyph.
- The project label remains stable across status changes.
- The Codex status line shows project, branch, model/reasoning, and context.
- `agents` shows the same state as the tab title.

## Roll back

Unregister the tab before removing the configuration:

```bash
agent-board unregister
```

Remove the merged Agent Board lines if you no longer want this workflow. Delete
the Shortcut if it is no longer wanted. You may restore
`cmd+shift+r=prompt_tab_title` only after Agent Board no longer owns the tab.
