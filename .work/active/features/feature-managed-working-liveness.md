---
id: feature-managed-working-liveness
kind: feature
stage: implementing
created: 2026-08-16
updated: 2026-08-16
tags: [state, integration]
parent: null
depends_on: []
release_binding: null
gate_origin: null
---

# Keep managed working state truthful for long-running turns

## Brief

A healthy managed Codex turn can remain active for hours without emitting
another lifecycle transition. The current 60-second `workingFreshForMs` policy
demotes that authoritative `working` observation to `?` whenever `agents`
reconciles after the threshold, even though the owned launcher and observer are
still healthy. The next real event restores the correct glyph, which Andrew
observed live when `?` returned to `✓` at completion.

Replace elapsed event age as the sole liveness signal for managed working state.
Keep `● working` while the managed observation topology is demonstrably alive,
and degrade to `?` when that topology is actually lost or cannot be trusted.
Preserve conservative handling for abandoned state, future timestamps,
ordinary/unmanaged sessions, closed terminals, and normal completion/input/error
transitions.

## Simplification opportunity

Remove the misleading coupling between legitimate turn duration and the
60-second projection threshold. Reuse the existing managed launcher identity and
reconciliation boundary if they provide sufficient liveness evidence; avoid a
daemon, heartbeat protocol, or new persisted schema unless the existing runtime
evidence cannot express the contract safely.

## Source observation

Promoted from `idea-managed-working-freshness`. Andrew runs agent tasks lasting
many hours, so a fixed one-minute working lifetime makes the attention board
materially untrustworthy even though eventual completion still recovers.

## Design decisions

- **Positive liveness source**: use the already persisted managed
  `launcherPid` and a process-existence port during reconciliation. This proves
  that a long quiet turn still has its owning topology without adding a daemon,
  heartbeat writes, or another timestamp to durable state.
- **Freshness fallback**: retain `workingFreshForMs` for managed working records
  that lack a live launcher binding. This preserves conservative behavior for
  legacy, partially initialized, or orphaned records rather than making every
  historical `working` value immortal.
- **Failure posture**: a missing or unprobeable launcher is stale diagnostic
  evidence, never idle or error. Native lifecycle evidence remains responsible
  for completion, input, interruption, and error semantics.
- **Dispatch**: direct-read design and one cohesive feature implementation. The
  relevant projection, reconciliation, process, composition, and test seams are
  explicit; exploratory fanout would add handoff cost without resolving an
  unknown.

## Architectural choice

Three approaches were considered:

1. **Delete working freshness entirely.** This is the smallest edit and keeps
   multi-hour turns working, but a hard-killed launcher can leave `●` behind
   indefinitely. It violates the product's conservative liveness principle.
2. **Write launcher heartbeats into every session record.** This makes expiry
   self-contained and detects a dead launcher after a bounded interval, but it
   adds periodic disk writes, timer lifecycle, and a new persisted timestamp
   solely to prove that an already owned local process exists.
3. **Probe the persisted launcher PID during reconciliation.** A healthy owned
   launcher positively authorizes old working evidence; a missing launcher is
   converted into explicit stale evidence before projection. The existing age
   threshold remains a fallback when no launcher binding exists.

Choose option 3. It uses the current per-tab topology and `agents`
reconciliation authority, changes no stored schema, writes only when liveness is
lost, and keeps projection pure. It also matches current operation: titles
change on native lifecycle events, while `agents` is the command that discovers
external terminal/process disappearance.

## Implementation Units

### Unit 1: Launcher liveness port and local process adapter

**Files**: `src/domain/ports.ts`, `src/integrations/launcher-liveness.ts`,
`tests/integrations/launcher-liveness.test.ts`

**Story**: `feature-managed-working-liveness-launcher-probe`

```ts
export interface LauncherLivenessPort {
  isAlive(pid: number): Promise<boolean>;
}

export interface NodeLauncherLivenessOptions {
  readonly kill?: typeof process.kill;
}

export class NodeLauncherLiveness implements LauncherLivenessPort {
  constructor(options?: NodeLauncherLivenessOptions);
  isAlive(pid: number): Promise<boolean>;
}
```

**Implementation notes**:

- Use signal `0`; never send a terminating signal. A successful probe or
  `EPERM` means the PID exists. `ESRCH`, an unsafe PID, or another inability to
  establish existence returns false so the caller degrades conservatively.
- Keep this as a small synchronous-platform adapter behind an async port. Do not
  add Codex semantics to it; it represents local process existence only.

**Acceptance criteria**:

- [ ] The adapter reports an existing PID without signaling it destructively.
- [ ] `ESRCH` and invalid/unsafe PIDs report missing; `EPERM` reports existing.
- [ ] Tests inject the kill function and never inspect or signal a real process.

### Unit 2: Reconcile launcher evidence before shared projection

**Files**: `src/application/reconcile-session.ts`,
`src/domain/projection.ts`, `src/composition/create-agents.ts`,
`src/composition/create-agent-codex.ts`,
`tests/application/reconcile-session.test.ts`,
`tests/domain/projection.test.ts`, and affected composition/application fixtures

**Story**: `feature-managed-working-liveness-projection-policy`

```ts
export interface ReconcileDependencies {
  readonly store: SessionStore;
  readonly terminal: ReconciliationTerminalPort;
  readonly launcher: LauncherLivenessPort;
  readonly clock: Clock;
  readonly workingFreshForMs: number;
}
```

**Implementation notes**:

- Probe only a `managed + working + live` record with `launcherPid`. A live PID
  leaves native agent evidence untouched; it does not refresh `observedAt` or
  rewrite the evidence kind.
- A missing PID atomically changes health to `stale` with local corroborated
  evidence and a terse diagnostic, while retaining the PID as forensic/runtime
  context. Do not infer idle, completion, or error.
- Projection treats a `managed + working + live + launcherPid` record as working
  regardless of native-event age, while retaining the future-timestamp guard.
  A working record without that binding still uses `workingFreshForMs`.
- Wire the process adapter only at the `agents` and managed-launch composition
  roots that own reconciliation. Update test dependencies explicitly rather
  than hiding a default inside application code.

**Acceptance criteria**:

- [ ] A managed live working record remains `●` hours after its last lifecycle
  event when the launcher binding is present.
- [ ] `agents` reconciliation probes the launcher and preserves native evidence
  unchanged when it is alive.
- [ ] A missing launcher produces `? diagnostic` with stale health and no false
  idle, completion, or error state.
- [ ] Old/future working evidence without a valid live binding remains subject
  to the conservative freshness diagnostic.
- [ ] Ordinary mode, terminal-presence precedence, attention, completion, and
  error behavior do not change.

## Implementation Order

1. Add and verify the launcher liveness port/adapter.
2. Integrate liveness into reconciliation and projection, then update all
   composition roots and regression fixtures.
3. Run focused tests, the packed journeys, typecheck, and the full suite; then
   align foundation/current operator documentation with the final contract.

## Simplification

- Keep one projection policy and one reconciliation boundary; do not add a
  background daemon, heartbeat loop, persisted heartbeat field, or second
  status map.
- Retain `workingFreshForMs` only for records without positive managed runtime
  evidence. If implementation shows the option no longer has any truthful
  caller, remove it and its tests rather than preserving dead tuning surface.
- No independent cleanup story is warranted; touched abstractions remain small
  and cohesive.

## Testing

- The projection regression uses an hours-old authoritative working record with
  `launcherPid` and protects the exact live bug: it must remain `●`.
- Reconciliation tests protect the cross-unit seam: live probe means no agent
  mutation; missing probe means stale diagnostic evidence before title render.
- Adapter tests protect non-destructive signal-0 error mapping with injected
  process behavior.
- Existing transition, title, board, and packed lifecycle journeys remain the
  regression net for unrelated state precedence. Do not add duplicate tests for
  each composition object.

## Risks

- **PID reuse**: signal 0 proves process existence, not process identity. The
  first reconciliation after a hard death normally observes `ESRCH`; an
  immediate PID reuse could temporarily retain `●`. Avoiding that entirely
  would require a persisted process-start token or heartbeat. Keep the V1 port
  narrow so stronger identity can replace its adapter if live use exposes this
  rare case.
- **Live process, broken observer**: process existence alone cannot prove event
  flow. The launcher already races observer/app-server termination and records
  failure; this feature relies on that existing ownership contract rather than
  duplicating protocol health in projection.
- **Reconciliation availability**: without a daemon, a hard-killed launcher is
  discovered when a command such as `agents` reconciles state. This matches the
  current local-first architecture; proactive expiry remains a future daemon or
  notification concern.

## Integrated implementation summary

- Added a signal-zero `LauncherLivenessPort` and injected Node adapter with
  conservative process-existence semantics (`ee060ff`).
- Reconciliation now checks positive managed launcher liveness before shared
  projection. Healthy launchers preserve native working evidence; missing or
  unprobeable launchers become stale, corroborated diagnostic evidence while
  retaining the PID.
- Projection authorizes hours-old working state only for a valid live managed
  launcher binding; unbound working records retain the existing freshness
  fallback and future timestamp guard.
- Wired explicit liveness dependencies through `agents`, managed Codex launch,
  and acknowledgement roots. Regression coverage protects live, missing,
  unbound, and ordinary behavior.
- Focused verification: `npx tsx --test --test-concurrency=1
  tests/domain/projection.test.ts tests/application/reconcile-session.test.ts
  tests/application/list-sessions.test.ts
  tests/application/launch-managed-codex.test.ts
  tests/application/operator-controls.test.ts` (37 passed); `npm run typecheck`
  (passed); `git diff --check` (passed).
