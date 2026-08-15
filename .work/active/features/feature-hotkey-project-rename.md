---
id: feature-hotkey-project-rename
kind: feature
stage: implementing
tags: [cli, integration, ui]
parent: null
depends_on: [feature-companion-terminal-configuration]
release_binding: null
gate_origin: null
created: 2026-08-15
updated: 2026-08-15
---

# Hotkey Project Rename

## Brief

Restore the convenience of Andrew's former Ghostty `⌘⇧R` rename workflow
without surrendering Agent Board's ownership of registered tab titles. Running
`agent-name` with no label captures the currently focused registered Ghostty
session, presents a native macOS rename prompt prefilled with its current project
label, updates only that label, and re-renders the canonical `<status> <label>`
title. The existing `agent-name <label>` registration and scripting path remains
unchanged.

Document a macOS Shortcut that invokes the installed command by absolute path and
binds it to `⌘⇧R`. The Ghostty config must leave that chord unbound so the
system shortcut receives it. Cancellation is a successful no-op; invalid labels,
missing registration, changed terminal identity, AppleScript failure, and title
reconciliation failure remain visible errors.

The native dialog is a deliberately trivial operating-system surface: one text
field, Cancel, and Rename. It follows the standard macOS interaction rather than
introducing a custom visual language, so an HTML screen mock would not resolve a
meaningful product choice.

## Simplification opportunity

Extend the existing `agent-name` command and reuse the current session store,
focused-terminal resolver, label validation, and title renderer. Do not add a
second rename command, inject text into Ghostty, restore Ghostty's manual title
override, or introduce a resident helper process.

## Design decisions

- **Invocation**: zero arguments opens the prompt; one argument retains the
  existing direct registration/rename behavior; two or more arguments return
  usage error 2.
- **Targeting**: require a focused, already-registered Ghostty terminal. Capture
  its full identity before opening the dialog because the dialog itself changes
  application focus.
- **Cancellation**: Cancel is a successful no-op with no stdout, store mutation,
  or title write.
- **Prompt**: use the standard macOS `display dialog` surface titled “Agent
  Board,” with the current label prefilled and conventional Cancel/Rename
  buttons. The native surface is too small and conventional for an HTML mock to
  settle additional taste.
- **Shortcut**: document a macOS Shortcut whose Run Shell Script action invokes
  the absolute installed `agent-name` path. Do not enable Ghostty's broader
  Shortcuts control integration and do not bind the chord inside Ghostty.

## Architectural choice

Use a dedicated application use case behind the existing `agent-name` CLI. It
captures the focused session, asks an injected prompt port for a new label,
mutates only that session's label, and calls the existing canonical title
renderer. A small macOS adapter implements the prompt through shell-free
`osascript` argv and a bounded result protocol.

Two alternatives were rejected. Calling `registerSession` after the prompt
would re-query focus after the dialog has stolen it and could rename the wrong
tab. Restoring Ghostty's `prompt_tab_title` and reconciling its manual override
would create competing title owners. A resident shortcut helper would add a
process and IPC boundary for a single on-demand interaction.

## Implementation Units

### Unit 1: Focus-stable rename use case

**Files**: `src/domain/ports.ts`, `src/application/prompt-rename-session.ts`

```typescript
export interface ProjectRenamePromptPort {
  prompt(currentLabel: string): Promise<string | null>;
}

export type PromptRenameSessionResult =
  | { readonly status: "cancelled" }
  | { readonly status: "renamed"; readonly record: SessionRecord };

export async function promptRenameSession(
  dependencies: PromptRenameSessionDependencies,
): Promise<PromptRenameSessionResult>;
```

**Implementation notes**:

- Resolve focus exactly once before invoking the prompt and retain the record's
  full Ghostty identity as the write guard.
- Parse the returned label at the application boundary before mutation.
- During mutation, verify the durable record still has the captured terminal
  identity. Preserve every non-label field and concurrent agent-state update.
- Reuse `renderSessionTitle(..., { expectedIdentity })` so projection comes from
  the latest durable record and a replaced registration cannot receive a title.

**Acceptance criteria**:

- [ ] The prompt receives the focused session's current label.
- [ ] Cancel performs no mutation or title write.
- [ ] Rename changes only `identity.projectLabel` and renders the latest status.
- [ ] Unregistered, ambiguous, invalid, missing, or identity-changed targets fail
      with stable typed errors.

### Unit 2: Native macOS prompt adapter

**Files**: `src/integrations/macos/rename-prompt.ts`,
`src/integrations/macos/scripts.ts`

```typescript
export interface MacOSRenamePromptOptions {
  command?: string;
  runner?: ProcessRunner;
  timeoutMs?: number;
  maxOutputBytes?: number;
}

export class MacOSRenamePrompt implements ProjectRenamePromptPort {
  constructor(options?: MacOSRenamePromptOptions);
  prompt(currentLabel: string): Promise<string | null>;
}
```

**Implementation notes**:

- Pass the current label as positional argv to a constant AppleScript; never
  interpolate it into source or invoke a shell.
- Return an exact cancellation sentinel or a renamed prefix plus a control-byte
  separator that valid labels cannot contain. Reject malformed output.
- Use a long but bounded human-interaction timeout and small output limit.

**Acceptance criteria**:

- [ ] The adapter maps Cancel to `null` and preserves the exact entered text.
- [ ] Non-zero exit, malformed protocol, timeout, and excess output are visible
      adapter failures.
- [ ] Metacharacters remain data in argv and cannot execute as shell syntax.

### Unit 3: CLI and composition wiring

**Files**: `src/cli/agent-name.ts`, `src/composition/create-agent-name.ts`

```typescript
export interface AgentNameCommand {
  register(input: RegisterSessionInput): Promise<RegisterSessionResult>;
  promptRename(): Promise<PromptRenameSessionResult>;
}
```

**Implementation notes**:

- Zero arguments call `promptRename`; one calls `register`; more show
  `Usage: agent-name [label]` and return 2.
- A completed rename prints `Renamed <label>`; cancellation stays silent so the
  shortcut does not create a distracting terminal artifact.
- Compose one shared store and Ghostty client for the use cases; inject the
  configured osascript executable into both adapters.

**Acceptance criteria**:

- [ ] Existing `agent-name <label>` behavior is unchanged.
- [ ] `agent-name` drives the prompt flow and exits 0 on rename or cancellation.
- [ ] The packaged binary's no-argument route is covered without a live dialog.

### Unit 4: Shortcut and configuration guidance

**Files**: `docs/configuration.md`, `examples/ghostty/agent-board.conf`,
`README.md`, `docs/ARCHITECTURE.md`

**Implementation notes**:

- Explain how to find the absolute binary path, create the Shortcut, add a Run
  Shell Script action, and bind `⌘⇧R` in Shortcut Details.
- Warn that macOS may request a separate Automation grant when Shortcuts is the
  invoking process.
- Keep the Ghostty chord unbound and explain why app-level bindings take
  precedence over the system shortcut.

**Acceptance criteria**:

- [ ] A new user can recreate the preferred shortcut without editing Agent
      Board state or Ghostty titles manually.
- [ ] Configuration guidance has one title owner and one documented rollback.

## Implementation Order

1. Native prompt protocol and adapter — trickiest unit because it crosses the
   human-time and AppleScript boundary.
2. Focus-stable rename use case.
3. CLI/composition wiring.
4. Documentation and packaged journey.

## Testing

### Unit tests

- `tests/integrations/macos/rename-prompt.test.ts`: argv safety, rename, cancel,
  malformed protocol, and process failure.
- `tests/application/prompt-rename-session.test.ts`: capture order, cancellation,
  field preservation, latest-status title projection, and identity race.
- `tests/cli/agent-name.test.ts`: zero/one/many argument routing, output, and typed
  errors.

### Integration tests

- Extend the packaged fake-osascript path so the installed `agent-name` binary
  proves the no-argument flow without showing a real macOS dialog.
- Run the full build, typecheck, and test suite; validate the Ghostty merge
  fragment with the installed Ghostty parser.

## Risks

- **Focus theft**: asking for focus after opening the prompt could target the
  wrong tab. **Fallback**: focus resolution is the first operation and the full
  identity guards mutation and rendering.
- **Long-lived prompt process**: an abandoned dialog could leave a Shortcut
  invocation waiting. **Fallback**: bound it to a generous human-interaction
  timeout; Cancel remains immediate.
- **Separate Automation identity**: Terminal and Shortcuts may have independent
  macOS permissions. **Fallback**: document the first-run grant and preserve the
  direct shell command as a recovery path.
- **Native-dialog variation**: OS wording or layout can vary across macOS
  releases. **Fallback**: depend only on AppleScript's stable returned value and
  cancellation semantics, not pixels or accessibility-tree details.
