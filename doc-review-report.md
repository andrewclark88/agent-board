# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Documents reviewed:** 17 indexable documents (7 system/historical planning + 10 research records), plus `AGENTS.md`, `README.md`, examples, current `.work/` state, implementation, tests, and the terminal-title repair commits
**Passes run:** 1 system-level pass; 0 module passes (no module planning corpus exists)
**Issues found:** Critical **0** · High **0** · Medium **0** · Low **0** · Info **3**

## Exit Gate

**Clean:** Critical = **0** and High = **0**.

This fresh full pass followed the completed Medium correction. It found no
Critical or High findings, so the Phase 4 auto-fix loop was not entered.

## Phase 1: Discovery

- `docs/knowledge-index.yaml` is present, schema-enforced (`schema_version: 2`),
  regenerated after the terminal-title repair, and lists 17 existing paths.
- System planning corpus: `VISION.md`, `PRINCIPLES.md`, `SPEC.md`,
  `ARCHITECTURE.md`, `configuration.md`, `research-plan.md`, and the explicitly
  superseded historical `project-brief.md`.
- Frontmatter compliance is 17/17 under the project's enforced index schema.
  All planning/historical documents have non-empty `description`, `type`, and
  `updated` fields. The two decision briefs declare `research_method: /research`;
  the prior-art campaign parent declares `/scout`.
- No module north stars, `docs/*/architecture/` module trees, or `modules/`
  planning directories were found. A module pass would have no subject.
- All local Markdown links in `README.md`, `AGENTS.md`, and `docs/*.md` resolve.
  All knowledge-index paths and all five archive-stub `git_ref` values resolve.

## Pass 1: System-Level

### Critical (0)

None.

### High (0)

None.

### Medium (0)

None.

### Low (0)

None.

### Info (3)

#### Frozen research retains the formerly documented `null` off-switch

**Files:** `.research/attestation/config-reference-tui.md`,
`.research/analysis/campaigns/agent-board-prior-art/parent.md`,
`.research/analysis/campaigns/agent-board-prior-art/specialists/codex-lifecycle.md`,
`.research/analysis/campaigns/agent-board-prior-art/verification-checklist.md`

**What:** These evidence artifacts accurately preserve what the consulted
reference said during the 2026-08-14 research engagement: that `null` disabled
Codex title updates. They are not executable instructions or current product
truth. The subsequent installed-runtime failure and repair supersede that claim
for Agent Board's Codex 0.147.x launcher.

**Disposition:** Preserve the research record. All current product and delivery
documents use the validated empty-sequence override. No non-historical `null`
contract remains.

#### No separate roadmap document

**Files:** `docs/research-plan.md`, `.work/backlog/roadmap-deferred-product-horizon.md`

**What:** Delivery status is correctly owned by `.work/`; the research plan owns
completed/deferred research and the backlog preserves non-binding future product
options. No current planning document claims a separate phase roadmap exists.

**Disposition:** Informational, not drift and not a missing blocker.

#### Generated knowledge-index refresh is intentionally uncommitted

**Files:** `docs/knowledge-index.yaml`, `docs/knowledge-index-nav.yaml`,
`docs/knowledge-index-detail.yaml`

**What:** The working tree contains the expected derived refresh after the
architecture correction and archived repair story: generation timestamps,
`ARCHITECTURE.md`'s 2026-08-16 update, and the archive count increasing from four
to five. The completed feature-body correction changes no indexed planning-doc
frontmatter, so the derived indexes remain consistent with current sources.

**Disposition:** Informational. This audit did not modify those working-tree
updates.

## Codex Terminal-Title Override Verification

The live failure, repair story, current contract, implementation, and regression
test were inspected as one chain.

| Contract | Evidence inspected | Result |
| --- | --- | --- |
| Codex receives a typed empty sequence, not a string-like `null`. | `docs/ARCHITECTURE.md`; `src/integrations/codex/process.ts`; `tests/integrations/codex/process.test.ts`. | Consistent. All use the exact pair `-c`, `tui.terminal_title=[]`. |
| Agent Board rejects caller attempts to replace its title or remote-transport ownership. | `README.md`; `src/integrations/codex/process.ts`; process-host tests. | Consistent. `--remote` and all supported `tui.terminal_title` override forms are rejected before spawn. |
| The repair has durable diagnosis and review provenance. | Archive stub `story-fix-codex-terminal-title-override` → review commit `a402d3b`; implementation commit `c0bc19a`; documentation commit `43dd7be`. | Consistent. The recorded symptom is the installed Codex sequence-type error, and the accepted fix is `[]`. |
| Exact argv remains executable and type-safe. | `npm run typecheck`; `npx tsx --test tests/integrations/codex/process.test.ts`. | Pass. Typecheck succeeded; focused process suite passed 7/7. |

The old `null` contract no longer appears in source code, tests, README,
foundation planning truth, or current delivery records. It remains only in
frozen research evidence and this report's historical explanation.

## Clean Areas

- Product truth remains consistent across vision, principles, specification,
  architecture, README, and backlog: local-first attention routing; one Codex
  session per Ghostty tab; no tmux, resident daemon, semantic actions, GUI,
  remote service, or hardware requirement in V1.
- The managed app-server plus remote-TUI default and ordinary-mode
  degraded-confidence boundary agree across `AGENTS.md`, the foundation docs,
  code, and package commands.
- The completed managed-launcher feature, locked architecture, implementation,
  and exact-argv regression test all specify `-c tui.terminal_title=[]` and
  explain or enforce the sequence requirement consistently.
- The four documented binaries—`agent-codex`, `agent-name`, `agents`, and
  `agent-board`—match `package.json`, `src/cli/`, and composition roots.
- Ghostty title ownership, stable-ID targeting, title clearing,
  hierarchy-aware liveness, and conservative uncertainty remain aligned with
  the locked Ghostty brief, implementation, tests, and operator guide.
- The five-state board/title projection, acknowledgement fallback, local atomic
  store, and error/degradation rules agree between foundation documents and
  domain/application surfaces.
- The expected source and test surfaces exist for all five completed epics, 15
  completed features, six active-tier completed stories, and five archived
  items. Every archive stub resolves to a commit.
- README and `docs/configuration.md` continue to route users through
  `agent-codex` without asking them to edit `tui.terminal_title` manually; the
  user's configured Codex status line remains a separate in-terminal surface.

## Blocking Briefs Status

There is no NEXT delivery phase that names a missing blocking brief. The locked
architecture is grounded by these on-disk artifacts.

| Brief | Supports | Exists on disk? | Status |
| --- | --- | --- | --- |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed Codex observation and launcher topology | Yes | Locked; `/research` complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity, title, liveness, and cleanup | Yes | Locked; `/research` complete |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Foundational V1 scope and deferred horizon | Yes | Locked; `/scout` complete |

## DONE Verification

| Delivery arc | Status | Expected output verified on disk | Result |
| --- | --- | --- | --- |
| Trustworthy session core | Done | Domain, storage, lock, and transition/projection tests | Present |
| Ghostty project surface | Done | AppleScript client/protocol/diagnostics, registration, reconciliation, and title tests | Present |
| Managed Codex observation | Done | App-server client, lifecycle/thread binding, launcher, exact empty-sequence argv test, and integration tests | Present and consistent |
| Swarm attention board | Done | Board application, CLI renderer, acknowledgement/unregister, and tests | Present |
| Operational readiness | Done | Doctor, packed artifact harness, golden/failure/chaos tests, and opt-in live probes | Present |
| Companion terminal configuration | Done | Ghostty/Codex fragments, configuration guide, README routing, and recorded validation | Present |
| Codex terminal-title repair | Done and archived | Valid `[]` launcher argument, regression test, architecture correction, review evidence | Present; focused verification passes |

## Provenance Summary

| research_method | Decision-bearing artifacts | Latest updated |
| --- | ---: | --- |
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

The highest applicable brief tier is `/research`; there are no lower-tier
decision briefs older than a newer higher-tier run, so there are no refresh
candidates. Remaining indexed campaign records and attestations are supporting
research artifacts, not duplicate current planning truth.

## Audit Boundary and Provenance

This was a fresh Phase 1–3 full system-level re-audit after the Medium
delivery-record correction, discovered from the regenerated knowledge index. It
inspected all system planning/historical docs, `AGENTS.md`, README, examples,
code, tests, current work/archive/backlog state, the two blocking runtime
briefs, the prior-art parent, and the terminal-title repair commits. No module
planning corpus was discovered, so no module pass was applicable.

The audit was performed with the inherited reviewer capability because the
configured Sonnet-named pass override was unavailable in the active roster. It
did not modify source documentation, code, work items, generated indexes,
package files, commits, or remote state; only this report was overwritten.
