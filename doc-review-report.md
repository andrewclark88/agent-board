# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**System planning docs reviewed:** 6
**Module docs reviewed:** 0
**Passes run:** 1 system-level pass
**Issue counts:** Critical 0, High 0, Medium 1, Low 0, Info 0
**Mechanical exit gate (Critical=0, High=0): PASS**

## Scope audited

- Indexed planning docs: `docs/VISION.md`, `docs/SPEC.md`, `docs/ARCHITECTURE.md`, `docs/PRINCIPLES.md`, `docs/research-plan.md`, `docs/configuration.md`
- Historical checkpoint: `docs/project-brief.md`
- Operator docs: `README.md`
- Blocking research: `.research/analysis/briefs/codex-detector-topology.md`, `.research/analysis/briefs/ghostty-registration-liveness.md`, `.research/analysis/campaigns/agent-board-prior-art/parent.md`
- Relevant implementation/tests/config: `src/application/{register-session,prompt-rename-session,resolve-session-target,launch-managed-codex}.ts`, `src/integrations/codex/{process,thread-binding}.ts`, `src/cli/agent-name.ts`, `examples/ghostty/agent-board.conf`, targeted tests under `tests/application`, `tests/cli`, `tests/e2e`, and `tests/integrations`
- Durable work state: active epics/features/stories, backlog, and all archive stubs under `.work/archive/`

## Pass 1: System-level findings

### Medium (1)

#### Generated knowledge index rewrites research doc types away from source frontmatter

**Files:** `docs/knowledge-index.yaml`; `.research/analysis/briefs/codex-detector-topology.md`; `.research/analysis/briefs/ghostty-registration-liveness.md`; `.research/analysis/campaigns/agent-board-prior-art/parent.md`

**What:** The generated index says it is `generated_from: frontmatter` and that frontmatter is the source of truth, but several indexed research entries are type-normalized to different values than their source files declare. Examples:

- `codex-detector-topology.md`: frontmatter `type: technical-brief`, index `type: brief`
- `ghostty-registration-liveness.md`: frontmatter `type: technical-brief`, index `type: brief`
- `parent.md`: frontmatter `type: landscape`, index `type: campaign`

This is not breaking the current planning corpus, but it can mislead consumers that filter or reason on exact type values.

**Why severity is Medium:** The docs and code contracts themselves remain aligned, but the derived knowledge layer is not faithfully reflecting source metadata for load-bearing research artifacts.

## Clean areas

- The current planning set is internally aligned on the accepted V1 shape: managed Codex app-server + remote TUI, Ghostty 1.3+ AppleScript targeting, ordinary sessions staying diagnostic until managed observation attaches, and no semantic agent-control surface in V1.
- The rename contract is consistent across docs, code, and tests:
  - managed one-label rename uses `AGENT_BOARD_SESSION_ID`
  - detached one-label rename without a bound session ID fails before focus resolution
  - no-argument rename remains the macOS prompt path
  - already-running managed sessions must restart once to inherit the new session binding
- The companion Ghostty example explicitly contains `keybind = cmd+shift+r=unbind`, and the docs correctly route `⌘⇧R` to the macOS **Rename Agent Tab** Service rather than Ghostty’s native **Change Tab Title...** action.
- I found no evidence of an ancestry-based fallback for managed rename targeting, and the current docs do not claim one.
- Archive retention is mechanically sound: all 14 `.work/archive/*.md` stubs contain `git_ref`, and every referenced commit resolves.
- Local markdown cross-references checked in `README.md` and `docs/*.md` resolve to existing local files.

## Blocking briefs status

| Brief | Role | Exists on disk? | Status |
|---|---|---:|---|
| `.research/analysis/briefs/codex-detector-topology.md` | Blocks Codex V1 topology decision | Yes | Written / locked |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Blocks Ghostty identity/title/liveness contract | Yes | Written / locked |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Prior-art scout grounding for scope/architecture | Yes | Written / locked |

## DONE-claim verification

| Area | Claim checked | Result |
|---|---|---|
| Planning + README | Managed rename uses exact bound session identity | Verified in docs, `src/cli/agent-name.ts`, `src/application/register-session.ts`, `src/integrations/codex/process.ts`, and targeted tests |
| Planning + README | Old managed sessions must restart once to inherit `AGENT_BOARD_SESSION_ID` | Verified in docs and launch/process wiring |
| Planning + README | No-arg rename is the macOS prompt path; one-label detached fallback is rejected | Verified in docs, `src/cli/agent-name.ts`, `src/application/prompt-rename-session.ts`, and tests |
| Planning + config | Ghostty shortcut handoff requires explicit unbind of native title action | Verified in `examples/ghostty/agent-board.conf` and `tests/integrations/ghostty/configuration.test.ts` |
| Planning + architecture | No ancestry fallback for Codex root-thread binding | Verified in `src/integrations/codex/thread-binding.ts` and tests: child threads with `parentThreadId` are rejected rather than used as fallback candidates |

## Provenance summary

| research_method | Indexed grounded artifacts | Latest updated |
|---|---:|---|
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

No refresh-candidate concern surfaced within the blocking research used by the current planning set.

## Final result

- Critical: 0
- High: 0
- Medium: 1
- Low: 0
- Info: 0

**Gate result:** PASS
