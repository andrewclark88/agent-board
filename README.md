# Agent-Board

Agent Board is a lightweight local attention router for supervising several
terminal coding agents without repeatedly visiting every session.

Its first proof targets Codex running in one Ghostty tab per project on macOS.
Agent Board will keep each registered tab titled with a machine-controlled status
and human-controlled project label, while an `agents` command renders the same
local state across the swarm.

The project has completed foundation ideation and a verified prior-art Scout.
Current product truth lives in [VISION](docs/VISION.md), [SPEC](docs/SPEC.md),
[ARCHITECTURE](docs/ARCHITECTURE.md), [PRINCIPLES](docs/PRINCIPLES.md), and the
[research plan](docs/research-plan.md).

## First workflow

```text
○ idle
● working
✓ finished / unread
! needs user input
× error
```

The first release deliberately avoids tmux, a GUI, semantic controls, a second
agent adapter, and hardware. Vendor neutrality survives as an adapter boundary,
not as simultaneous implementation breadth.

## Current next step

Run the two focused engagements in `docs/research-plan.md`: prototype Codex
ordinary-TUI versus managed app-server-backed TUI observation, and validate the
Ghostty AppleScript registration/title/liveness contract. Detailed architecture
and `.work/` decomposition follow those decisions.
