# Doc Review Report

**Project:** Agent Board

**Date:** 2026-08-20

**Documents reviewed:** 6 system planning documents plus README, AGENTS,
historical/migration guidance, the knowledge indexes, research corpus, work
substrate, and matching code/test/package surfaces

**Passes run:** 4 fresh system-level passes; no module planning docs discovered

**Final issues:** 0 Critical, 0 High, 1 Medium, 1 Low, 1 Info

## Exit gate

**PASS:** the final fresh independent audit found zero Critical and zero High
issues.

## Auto-fix loop

The initial independent pass found two Critical and one High issue:

- the mixed-provider test returned the managed Claude row before authoritative
  idle evidence arrived, contradicting the recorded green verification;
- `docs/research-plan.md` still described Claude as deferred future work; and
- `docs/ARCHITECTURE.md` omitted Claude's version-compatibility decision.

The receiver strengthened the test's convergence predicate, rolled the completed
Claude research into the research plan, and documented the Claude compatibility
floor and warning policy. The next fresh audit found the two Claude hook entry
files absent from the architecture module map; those entries were added. The
following audit found `AGENTS.md` still described the pre-Claude repository
state; its current-state section was rolled forward. The fourth fresh audit
returned 0 Critical and 0 High.

## Final findings

### Critical (0)

None.

### High (0)

None.

### Medium (1)

#### Historical work-item bodies retain the former Codex compatibility boundary

Several completed Codex feature bodies describe compatibility as `0.147.x`
only, while current code and foundation docs accept tested `0.147.x` and
`0.148.x` and reject `0.149.x`.

**Disposition:** non-blocking historical substrate prose. Git owns delivery
history; current code, tests, architecture, README, and operator guidance agree.

### Low (1)

The architecture module map omits the pre-existing `src/domain/errors.ts` file.
This is cosmetic and unrelated to the symmetric-provider delivery.

### Info (1)

The Claude event-rules prose names the operator-significant events but does not
enumerate every one of the 11 packaged hook events. All events are wired and
handled correctly in the plugin and lifecycle mapper.

## Clean areas

- Shared `○ ● ✓ ! ×` glyph semantics and the diagnostic `?` fallback agree
  across vision, specification, architecture, README, research, and code.
- Codex app-server/remote-TUI and Claude ordinary-CLI/bundled-hook topologies are
  documented consistently with the implementation.
- Claude `2.1.226` floor, tested `2.1.x` family, and warning behavior for newer
  families match the compatibility and doctor code.
- All local documentation links resolve, and no module-level planning-doc sets
  exist.
- The packed Claude plugin, five npm binaries, mixed-provider runtime journey,
  and opt-in installed probes exist as documented.
- The complete suite reports 231 tests: 228 passed, zero failed, and three
  intentional opt-in skips.

## Blocking briefs status

| Brief or campaign | Exists | Status |
| --- | --- | --- |
| `.research/analysis/briefs/codex-detector-topology.md` | Yes | Locked/complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Yes | Locked/complete |
| `.research/analysis/briefs/claude-code-adapter-feasibility.md` | Yes | Locked/complete |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Yes | Complete |
| `.research/analysis/campaigns/codex-claude-symmetric-support/parent.md` | Yes | Locked/complete |
| `.research/analysis/positions/codex-claude-common-glyph-contract.md` | Yes | Locked/complete |

No `[needs-brief]` gaps remain.

## Completed-output verification

- `epic-codex-claude-symmetric-support` and all four child features are done.
- Package bins, Claude plugin assets, application/integration modules, and tests
  named by the architecture exist.
- Three consecutive focused mixed-provider packed runs passed.
- A complete serialized `npm test` run passed 228 tests with zero failures and
  three opt-in skips; typecheck/build completed successfully.

## Provenance summary

| research_method | Artifacts | Latest updated |
| --- | ---: | --- |
| `/research` | 5 focused outputs | 2026-08-20 |
| `/scout` | 1 campaign parent | 2026-08-14 |

No actionable refresh candidates were identified.
