# Agent Board

Agent Board is a local attention router for terminal coding agents. It shows
which Ghostty tabs need attention without requiring a manual tab scan.

The first release supports Codex in one Ghostty tab per project on macOS. It
owns each registered tab title and renders the same state through `agents`.

```text
● data-platform        working
! acquisition          needs input
✓ agent-board          finished
○ legacy-engine        idle
× reporting            error
```

## Requirements

- macOS
- Node.js 22 or later
- Ghostty 1.3 or later
- Codex 0.147.x
- npm

Agent Board uses Ghostty AppleScript and macOS Automation. It does not require
tmux, a daemon, a database server, or network access for local board operations.

## Configure Ghostty

Enable AppleScript in your Ghostty configuration:

```text
macos-applescript = true
```

Remove any global `title` setting. If `bell-features` includes `title`, add
`no-title`. Restart Ghostty after a configuration change.

Agent Board owns the complete title of each registered tab. Do not use Ghostty's
manual title override for those tabs.

## Install from a checkout

1. Install the dependencies.

   ```bash
   npm install
   ```

2. Build the four commands.

   ```bash
   npm run build
   ```

3. Link the package into your npm command path.

   ```bash
   npm link
   ```

   To test a standalone local artifact, pack and install it instead:

   ```bash
   npm pack --ignore-scripts
   npm install --global ./agent-board-0.1.0.tgz
   ```

4. Open a Ghostty tab.

5. Check the supported environment.

   ```bash
   agent-board doctor
   ```

The first AppleScript check may cause a macOS Automation prompt. Grant the
requested Ghostty control, then run the doctor again.

The doctor checks the runtime, local state directory, Codex, and Ghostty. It
returns nonzero when an error blocks managed operation. Warnings do not block
managed operation.

Use JSON for automation:

```bash
agent-board doctor --json
```

## Start the first managed session

1. Open a Ghostty tab in the project directory.

2. Give the tab a stable project label.

   ```bash
   agent-name agent-board
   ```

3. Start Codex through the managed launcher.

   ```bash
   agent-codex
   ```

`agent-codex` starts a private Codex app-server and connects the normal remote
TUI. It forwards supported extra Codex arguments unchanged; Agent Board reserves
the remote transport and terminal-title override, so arguments that set
`--remote` or `tui.terminal_title` are rejected.

You may omit `agent-name`. The launcher then registers the current tab with a
label derived from its repository or working directory.

Start another project in another Ghostty tab. Repeat the same commands there.

## Use the board

Run the human-readable board from any terminal:

```bash
agents
```

Use JSON when a script needs session IDs or diagnostic details:

```bash
agents --json
```

The five normal symbols have one meaning each:

| Symbol | Meaning | Operator action |
| --- | --- | --- |
| `○` | The agent is idle. | None. |
| `●` | The agent is working. | None. |
| `✓` | Work finished and remains unread. | Visit or acknowledge it. |
| `!` | The agent needs input. | Visit the tab and respond in Codex. |
| `×` | The agent or managed launcher failed. | Visit the tab and inspect the error. |

A `?` row is a diagnostic state, not a sixth agent outcome. It means Agent
Board cannot prove a current state or terminal presence.

Board diagnostics may report stale evidence, hidden tabs, missing terminals, or
title synchronization failures. Agent Board does not relabel uncertainty as idle.

## Rename, acknowledge, and unregister

Focus a registered Ghostty tab, then rename it:

```bash
agent-name data-platform
```

The label changes independently from agent state and session identity.

While the managed launcher runs, it acknowledges unread completion when the
registered Ghostty tab becomes frontmost. After the launcher exits, or when
focus evidence is unavailable, use the explicit command:

```bash
agent-board ack
```

The no-argument form requires Ghostty to be frontmost. It targets the current
registered tab. From another application, pass the exact ID from `agents --json`:

```bash
agent-board ack 7b470263-224b-4f1f-a59b-e9537d23d152
```

Unregister the frontmost tab before closing or uninstalling Agent Board:

```bash
agent-board unregister
```

You may also pass an exact session ID. Unregister clears Agent Board's title
override before it removes the session record.

## State and recovery

Agent Board stores local state under:

```text
~/.local/state/agent-board/v1
```

Set `AGENT_BOARD_STATE_DIR` to choose a different base directory. Agent Board
adds its `v1` directory below that base.

The state store uses ordinary JSON files, atomic replacement, and bounded file
locks. It stores project and terminal metadata, not prompt content or secrets.

If a row shows `?`, run these commands:

```bash
agent-board doctor
agents
```

Follow the remediation beside each doctor error. Common repairs include these
actions:

- Open a Ghostty window before registration.
- Enable `macos-applescript` and restart Ghostty.
- Grant macOS Automation permission.
- Remove a fixed Ghostty `title` setting.
- Add `no-title` to title bell features.
- Install the supported Codex 0.147.x family.

If title clearing fails, Agent Board keeps the session record. Repair Ghostty,
then retry `agent-board unregister` with the exact session ID.

## Current limits

- Codex is the only agent adapter.
- Managed launch through `agent-codex` provides the supported state fidelity.
- A separately started `codex` process is not attached after launch.
- One supervised agent per Ghostty tab is supported.
- The first release does not send approvals, input, interrupts, or keystrokes.
- The first release has no GUI, menu-bar app, remote service, or hardware dependency.

These deferred directions remain in the project backlog. They are preserved as
options and do not expand the first release.

## Test the checkout

Run the complete hermetic suite:

```bash
npm test
```

The suite builds and installs a packed artifact in temporary directories. It
uses private executable substitutes and does not touch live Ghostty tabs.

Two live compatibility probes are opt-in. The Codex probe reads generated
protocol schemas. The Ghostty probe creates and removes a disposable window.

```bash
AGENT_BOARD_LIVE_CODEX=1 npm run test:integration:codex
AGENT_BOARD_LIVE_GHOSTTY=1 npm run test:integration:ghostty
```

Do not run the Ghostty probe when disposable window creation is unacceptable.

## Uninstall

1. Unregister each remaining session from its tab or exact session ID.

2. Remove the global npm link.

   ```bash
   npm unlink --global agent-board
   ```

3. Remove the checkout when you no longer need it.

Agent Board leaves its local state directory in place. You may remove that
directory after all sessions are unregistered.

## Project references

Current product truth lives in [VISION](docs/VISION.md), [SPEC](docs/SPEC.md),
[ARCHITECTURE](docs/ARCHITECTURE.md), and [PRINCIPLES](docs/PRINCIPLES.md).
Grounded findings live under [`.research/`](.research/).
