---
id: feature-automatic-missing-session-cleanup
kind: feature
stage: review
tags: [state, cli, integration]
parent: null
depends_on: [epic-ghostty-project-surface-title-reconciliation, epic-swarm-attention-board-board-command]
release_binding: null
gate_origin: null
created: 2026-08-15
updated: 2026-08-15
---

# Automatic Missing Session Cleanup

## Brief

Make ordinary Ghostty tab closure a complete Agent Board retirement workflow.
During an `agents` board refresh, retain registered terminals that are visible,
hidden/undoable, or unknown because inspection failed, but automatically remove
a session once the authoritative Ghostty snapshot reports its terminal as
missing from the application-wide terminal collection.

Ghostty's hidden/enumerable state is the grace period: closing and undoing a tab
must preserve the session and its title, while a terminal that Ghostty has fully
released no longer needs a diagnostic tombstone. The board should omit a pruned
session in the same invocation. If removal fails, retain and display the missing
diagnostic so cleanup is retryable rather than silently claimed.

Keep `agent-board unregister` for deliberately releasing a still-open or hidden
tab, troubleshooting, and uninstall workflows. Remove it from the normal `⌘W`
path and do not add a daemon, timer, schema field, cleanup command, or user
configuration.

## Simplification opportunity

Use the existing one-snapshot `agents` reconciliation and Ghostty
`visible | hidden | missing | unknown` classification as the complete cleanup
policy. This makes a separate time-based tombstone model and routine manual
unregister step unnecessary.

## Design decisions

- Cleanup is driven by the next `agents` board read; V1 does not add a daemon,
  timer, cleanup command, schema field, or configurable expiry.
- `visible`, `hidden`, and `unknown` registrations remain. In particular,
  Ghostty's application-enumerable `hidden` state is the undo-close grace
  period, and a failed snapshot becomes `unknown` rather than deletion.
- Only batch board reconciliation prunes an authoritatively classified
  `missing` session. Single-session reconciliation remains diagnostic so
  explicit controls do not gain a surprising deletion side effect.
- A successful prune omits the session from that same board response. If store
  removal fails, the missing record remains visible and a later board read may
  retry cleanup.
- Manual unregister remains an exceptional control for releasing a still-open
  or undo-hidden tab, troubleshooting, and uninstall.

## Architectural choice

Prune in the existing `reconcileSessions` batch after `reconcileLoaded` has
classified and persisted a record as `missing` from one validated Ghostty
snapshot. This keeps the policy at the `agents` application boundary, uses the
existing `SessionStore.remove(sessionId)` contract, and preserves the current
per-record recovery path when removal fails.

Two alternatives were rejected. Deleting inside `reconcileLoaded` or
`reconcileSession` would make acknowledgement, title repair, and other
single-session callers unexpectedly destructive. Persisting `missingSince` and
expiring tombstones later would add time, schema, and configuration even though
Ghostty already exposes the meaningful grace state: a closed-but-undoable tab
is still enumerable as `hidden`.

The trickiest unit is partial-failure behavior during batch reconciliation. A
prune is attempted only after a valid shared snapshot proves absence. Success
returns no row; failure falls through the existing per-record recovery path,
which reloads and emits the persisted `missing` diagnostic without abandoning
other sessions.

## Implementation Units

### Unit 1: Batch cleanup policy

**File**: `src/application/reconcile-session.ts`

```typescript
export async function reconcileSessions(
  dependencies: ReconcileDependencies,
): Promise<readonly ReconcileResult[]>;
```

**Implementation Notes**:

- Reconcile each loaded record against the one validated snapshot.
- When the returned record has `terminal.presence === "missing"`, call
  `dependencies.store.remove(record.sessionId)` and do not append a result.
- Preserve the current catch behavior: a failed removal reloads the record and
  appends its diagnostic result; an already-removed record is omitted.
- Do not change `reconcileSession`, the terminal-presence model, or the store
  interface.

**Acceptance Criteria**:

- [ ] A missing session is removed and absent from the same batch result.
- [ ] Visible and hidden sessions remain registered.
- [ ] Snapshot failure marks sessions unknown and removes none.
- [ ] Removal failure retains and returns the missing diagnostic while other
      records continue reconciling.

### Unit 2: Public board and packaged behavior tests

**Files**: `tests/application/reconcile-session.test.ts`,
`tests/application/list-sessions.test.ts`, `tests/e2e/packaged-golden.test.ts`

**Implementation Notes**:

- Exercise the batch policy at its application seam, including removal
  failure, rather than duplicating storage implementation tests.
- Extend the packed user journey by removing a terminal from the fake Ghostty
  application, running `agents`, and proving the registration disappears
  without an unregister command.

**Acceptance Criteria**:

- [ ] Tests distinguish hidden/undoable retention from authoritative missing
      cleanup.
- [ ] Repeating a board read after cleanup is harmless.
- [ ] The packed command path proves ordinary tab closure needs no manual
      unregister step.

### Unit 3: Current user and architecture contract

**Files**: `README.md`, `docs/SPEC.md`, `docs/ARCHITECTURE.md`

**Implementation Notes**:

- Describe `⌘W` plus the next `agents` refresh as the normal retirement flow.
- Keep manual unregister documented for still-open/hidden tabs and uninstall.
- State that `unknown` is retained and `missing` is pruned only from a valid
  application-wide Ghostty snapshot.

**Acceptance Criteria**:

- [ ] User docs no longer require unregister before ordinary tab closure.
- [ ] Foundation docs match the implemented lifecycle and failure semantics.

## Implementation Order

1. Batch cleanup policy and focused application tests — establish the hardest
   safety boundary first.
2. Public board and packaged journey — verify the user-visible seam.
3. Documentation — align setup, usage, and architecture after behavior is
   green.

## Testing

### Unit tests: `tests/application/reconcile-session.test.ts`

Use records with distinct terminal IDs in one shared snapshot. Prove visible
and hidden retention, missing removal/omission, snapshot-failure retention as
unknown, and removal-failure diagnostic recovery.

### Application tests: `tests/application/list-sessions.test.ts`

Verify `listSessions` exposes only retained records and its empty-store fast
path remains intact.

### Packaged end-to-end: `tests/e2e/packaged-golden.test.ts`

Register two fake Ghostty tabs, remove one terminal from the application-wide
scenario, run the packed `agents` binary twice, and verify only the surviving
registration remains.

## Risks

- **False deletion after adapter failure**: absence is meaningful only within a
  validated snapshot. Snapshot errors retain every record as `unknown`.
  **Fallback**: keep the current non-destructive unknown reconciliation path.
- **Breaking Ghostty undo-close**: a closed surface may still be alive outside
  the visible hierarchy. **Fallback**: retain every application-enumerable
  terminal as `hidden`; never treat hierarchy absence alone as missing.
- **Partial store failure**: record deletion may fail after presence was
  persisted. **Fallback**: return the missing diagnostic and retry on a later
  board read.
- **Refresh cadence**: a closed tab remains registered until `agents` next
  runs. This is intentional for V1; a future refreshing board can invoke the
  same reconciliation path more frequently without changing cleanup policy.

No child stories are needed; the behavior, tests, and documentation form one
small, tightly coupled implementation stride.

## Implementation notes

- Execution capability: inline frontier implementation; the feature is a
  bounded reconciliation change whose safety depends on keeping code and tests
  under one owner.
- Review weight: standard, from `.work/CONVENTIONS.md`.
- Files changed: `src/application/reconcile-session.ts`,
  `tests/application/reconcile-session.test.ts`,
  `tests/application/list-sessions.test.ts`,
  `tests/e2e/packaged-golden.test.ts`, `README.md`, `docs/SPEC.md`, and
  `docs/ARCHITECTURE.md`.
- Tests added/changed: batch reconciliation now proves visible/hidden retention,
  authoritative missing removal, removal-failure recovery, and snapshot-failure
  retention; the public board test proves same-response omission; the packaged
  golden journey closes a terminal and proves repeated `agents` reads stay
  clean without unregister.
- Simplification: reused the existing shared snapshot, presence classifier,
  store removal port, and per-record recovery path; added no lifecycle type,
  timer, daemon, command, or configuration.
- Discrepancies from design: none.
- Adjacent issues parked: none. A future continuously refreshing board is
  already within the deferred product horizon and is not required for this
  cleanup contract.

## Verification evidence

- `npm run typecheck`
- `npm test` — full suite green, including packaged end-to-end journeys
- Focused application reconciliation/list tests — 11 passed
- Focused packaged golden journey — passed against the packed install
