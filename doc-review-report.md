# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Documents reviewed:** 17 indexable documents (7 system/historical planning + 10 research records), plus `AGENTS.md`, `README.md`, examples, current `.work/` state, implementation, tests, and recent fix commits
**Passes run:** 1 system-level pass; 0 module passes (no module planning corpus exists)
**Issues found:** Critical **0** · High **0** · Medium **0** · Low **0** · Info **2**

## Exit Gate

**Clean:** Critical = **0** and High = **0**.

## Phase 1: Discovery

- `docs/knowledge-index.yaml` is present, schema-enforced (`schema_version: 2`), and lists 17 existing paths.
- System planning corpus: `VISION.md`, `PRINCIPLES.md`, `SPEC.md`, `ARCHITECTURE.md`, `configuration.md`, `research-plan.md`, and the explicitly superseded historical `project-brief.md`.
- All 7 planning/historical documents have non-empty `description`, `type`, and `updated` frontmatter. The two decision briefs declare `research_method: /research`; the prior-art campaign parent declares `/scout`.
- No module north stars, `docs/*/architecture/` module trees, or `modules/` planning directories were found. A module pass would have no subject.
- All local Markdown links in `README.md`, `AGENTS.md`, and `docs/*.md` resolve. All index entries resolve to files.

## Pass 1: System-Level

### Critical (0)

None.

### High (0)

None.

### Medium (0)

None.

### Low (0)

None.

### Info (2)

#### No separate roadmap document

**Files:** `docs/research-plan.md`, `.work/backlog/roadmap-deferred-product-horizon.md`
**What:** Delivery status is correctly owned by `.work/`; the research plan owns completed/deferred research and the backlog preserves non-binding future product options. No current planning document claims a separate phase roadmap exists.
**Disposition:** Informational, not drift and not a missing blocker.

#### Generated knowledge-index refresh is intentionally uncommitted

**Files:** `docs/knowledge-index.yaml`, `docs/knowledge-index-nav.yaml`, `docs/knowledge-index-detail.yaml`
**What:** The working tree contains only the expected derived refresh: generation timestamp, `configuration.md`'s 2026-08-16 date, and substrate counts updated to six backlog items and four archived items. The derived index agrees with current source frontmatter.
**Disposition:** Informational. This audit made no change to those user-owned working-tree updates.

## Latest Ghostty Integration Verification

The live Ghostty 1.3.1 repair record, code, tests, and operator documentation are aligned.

| Contract | Evidence inspected | Result |
| --- | --- | --- |
| Contiguous trailing AppleScript terminators are accepted, while blank/malformed interior rows remain invalid. | `.work/archive/story-fix-ghostty-trailing-newlines.md` resolves to `e0e2f89`; `src/integrations/ghostty/protocol.ts`; `tests/integrations/ghostty/protocol.test.ts`. | Consistent. `withoutTrailingLineBreaks` is applied to structured protocol payloads; the test accepts `\n\n` only at the boundary and still rejects an interior blank row. |
| Title set and clear use Ghostty's declared targeted-action parameter. | `.work/archive/story-fix-ghostty-title-action-parameter.md` resolves to `36042ce`; `src/integrations/ghostty/scripts.ts`; `tests/integrations/ghostty/client.test.ts`. | Consistent. Both scripts issue `perform action … on term`, not the invalid historical `against term` syntax. |
| A disposable live integration covers the same grammar without borrowing a user tab. | `tests/integration/disposable-ghostty.test.ts` and archived story acceptance evidence. | Consistent. The opt-in probe creates a separate window, sets and clears the tab title with `on probeTerminal`, then closes it. |
| Doctor's deliberately non-destructive title-action limitation is not represented as shipped capability. | `.work/backlog/idea-doctor-title-action-probe.md`; `src/integrations/ghostty/diagnostics.ts`; `README.md`. | Consistent. Doctor checks version/config/Automation/current context but does not claim to execute a targeted `set_tab_title` readiness probe. The backlog item remains future hardening. |

## Services Rename Setup Verification

`README.md`, `docs/configuration.md`, and `examples/ghostty/agent-board.conf` agree with the proved macOS workflow:

- `agent-name` with no label is the focused-session native rename prompt; `agent-name <label>` remains the direct shell path.
- The Shortcut uses **Run Shell Script**, `/bin/zsh`, an explicit Homebrew PATH, `exec /opt/homebrew/bin/agent-name`, and **Run as Administrator** remains off.
- **Services Menu** is enabled in Shortcut Details; `⌘⇧R` is assigned through **System Settings → Keyboard → Keyboard Shortcuts → Services**.
- Ghostty leaves `cmd+shift+r` unbound so `prompt_tab_title` cannot intercept the shortcut.
- Only Shortcuts **Allow Running Scripts** is required; the separately prompted macOS Automation grant is accurately described.

The configuration guide is the detailed source of truth and the README links to it without duplicating obsolete setup instructions. The example fragment likewise leaves the chord unbound and does not mutate an operator's full Ghostty configuration.

## Clean Areas

- Product truth is consistent across vision, principles, specification, architecture, README, and backlog: local-first attention routing; one Codex session per Ghostty tab; no tmux, resident daemon, semantic actions, GUI, remote service, or hardware requirement in V1.
- The settled managed app-server plus remote-TUI default and ordinary-mode degraded-confidence boundary agree across `AGENTS.md`, `docs/research-plan.md`, `docs/SPEC.md`, `docs/ARCHITECTURE.md`, code, and package commands.
- The four documented binaries—`agent-codex`, `agent-name`, `agents`, and `agent-board`—match `package.json`, `src/cli/`, and composition roots.
- The Ghostty ownership, ID-targeting, title-clear, hierarchy-aware liveness, and non-destructive uncertainty contracts remain consistent with the locked Ghostty brief and implementation.
- The five-state board/title projection, acknowledgement fallback, local atomic store, and error/degradation rules agree between the foundation documents and their domain/application surfaces.
- All five epics, 15 features, six stories, and the standalone lock-contention story currently shown by `work-view` are `done` with their expected source/test surfaces present. The four archive stubs have resolving `git_ref` provenance.
- The archived 2026-08-16 Ghostty fixes are accurately represented as completed history. The only related unfinished item is explicitly the **backlog** doctor-title-action probe; it is not treated as implemented.

## Blocking Briefs Status

There is no NEXT delivery phase that names a missing blocking brief. The current architecture is grounded by the following on-disk, locked artifacts.

| Brief | Supports | Exists on disk? | Status |
| --- | --- | --- | --- |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed Codex observation and launcher topology | Yes | Locked; `/research` complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity, title, liveness, and cleanup | Yes | Locked; `/research` complete |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Foundational V1 scope and deferred horizon | Yes | Locked; `/scout` complete |

## DONE Verification

This read-only audit verified expected files and recorded evidence; it did not rerun tests.

| Delivery arc | Status | Expected output verified on disk | Result |
| --- | --- | --- | --- |
| Trustworthy session core | Done | Domain, storage, lock, and transition/projection tests | Present |
| Ghostty project surface | Done | AppleScript client/protocol/diagnostics, registration, reconciliation, and title tests | Present |
| Managed Codex observation | Done | App-server client, lifecycle/thread binding, launcher, and integration tests | Present |
| Swarm attention board | Done | Board application, CLI renderer, acknowledgement/unregister, and tests | Present |
| Operational readiness | Done | Doctor, packed artifact harness, golden/failure/chaos tests, and opt-in live probes | Present |
| Companion terminal configuration | Done | Ghostty/Codex fragments, configuration guide, README routing, and recorded validation | Present |
| Latest Ghostty repairs | Done and archived | Terminator regression test, `on term` request assertions, and disposable live probe | Present |

## Provenance Summary

| research_method | Decision-bearing artifacts | Latest updated |
| --- | ---: | --- |
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

The highest applicable brief tier is `/research`; there are no lower-tier decision briefs older than a newer higher-tier run, so there are no refresh candidates. Remaining indexed campaign records and attestations are supporting research artifacts, not duplicate current planning truth.

## Audit Boundary

This is a Phase 1–3 documentation and artifact-consistency audit. It intentionally does not flag unimplemented future options, absent test coverage, or the preserved doctor-title-action probe as documentation drift. No source documentation, code, work item, index, package file, commit, or remote state was changed; only this report was overwritten.
