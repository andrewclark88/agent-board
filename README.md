# Agent-Board

Agent-Board is a proposed premium, local-first control surface for supervising
multiple AI agent sessions across terminals, applications, and providers.

Its job is attention management: show what is working, waiting, complete, or
failed; identify where human attention has the highest value; and move the user
to that session with one trusted action.

The project is currently at a concept checkpoint. See
[the project brief](docs/project-brief.md) for the reviewed thesis, constraints,
MVP hypothesis, and questions that must be grounded before architecture.

## Intended workflow

The initial environment is macOS, tmux, Ghostty, Codex CLI, and Claude Code, but
the product direction is terminal-flexible and vendor-neutral. Software comes
first: daemon, adapter contract, normalized state, safe actions, navigation, and
a simulated device. Physical hardware follows only after the control plane is
useful and trustworthy.

## Next step

Begin a new discovery arc with `research-pipeline:ideate`. Its Scout engagement
should examine adjacent products, terminal/agent lifecycle integrations, device
interaction patterns, wireless constraints, and premium control-surface prior
art before the product contract is locked.
