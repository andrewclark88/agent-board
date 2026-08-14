# Agent-Board

Agent Board is a lightweight local attention router for supervising several
terminal coding agents without repeatedly visiting every session.

Its first proof targets Codex running in one Ghostty tab per project on macOS.
Agent Board will keep each registered tab titled with a machine-controlled status
and human-controlled project label, while an `agents` command renders the same
local state across the swarm.

The project has completed foundation ideation, a verified prior-art Scout, and
focused Codex and Ghostty runtime research. Managed Codex app-server plus remote
TUI is the accepted V1 default, and the implementation architecture is locked.
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

Bootstrap the `.work/` delivery substrate, preserve deferred product options as
backlog ideas, decompose the terminal V1, and execute the ready queue. The
completed runtime findings remain available in `.research/analysis/briefs/`.
