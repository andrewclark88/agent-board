---
id: story-fix-codex-terminal-title-override
kind: story
stage: done
tags: [bug]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Pass a valid empty terminal-title sequence to Codex

## Symptom

Running `agent-codex` with Codex 0.147.0 exits before the TUI starts:

```text
Error loading config.toml: invalid type: string "null", expected a sequence
in `tui.terminal_title`
```

## Root cause

`CodexProcessHost.startRemoteTui` appends
`-c tui.terminal_title=null`. Codex's override parser treats the unsupported TOML
`null` token as the literal string `"null"`, but `tui.terminal_title` requires a
sequence.

## Fix approach

Pass the valid empty TOML array `tui.terminal_title=[]`. This disables Codex's
terminal-title components while preserving Agent Board's exclusive title
ownership.

## Regression test

`tests/integrations/codex/process.test.ts` asserts the exact spawned remote-TUI
argv contains `-c tui.terminal_title=[]`.

## Implementation notes

- Execution capability: focused local repair; the defect is one incorrect
  launcher argument with a directly testable process boundary.
- Files changed: `src/integrations/codex/process.ts`,
  `tests/integrations/codex/process.test.ts`, and the launcher contract in
  `docs/ARCHITECTURE.md`.
- Regression evidence: the updated exact-argv test failed against `null` and
  passes with `[]`.
- Original reproduction: installed Codex 0.147.0 rejects
  `tui.terminal_title=null` with the reported sequence error, while
  `tui.terminal_title=[]` passes configuration loading and reaches the expected
  non-terminal stdin check in the bounded probe.
- Verification: focused process tests pass (7/7); `npm run typecheck` passes;
  the full suite passes (171 passed, 2 opt-in skipped); and the installed Codex
  compatibility probe passes.
- Adjacent issues parked: none.

## Review (2026-08-16)

**Verdict**: Approve

**Blockers**: none
**Important**: none
**Nits**: none
**Rejected**: none

**Notes**: Bounded inline standalone-story review; no independent or cross-model
reviewer ran. Correctness, regression coverage, process/argument safety,
compatibility impact, and foundation-doc alignment were inspected. The change
replaces only the invalid TOML value, preserves shell-free argv transport, and
is confirmed by both the exact spawn contract and the installed Codex parser.
