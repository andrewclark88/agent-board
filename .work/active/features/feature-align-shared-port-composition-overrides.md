---
id: feature-align-shared-port-composition-overrides
kind: feature
stage: done
tags: [refactor]
parent: null
depends_on: []
release_binding: null
gate_origin: patterns
created: 2026-08-16
updated: 2026-08-16
---

# Align shared ports and composition overrides

## Brief

Reconcile the three behavior-preserving inconsistencies found by the patterns
gate. Reuse the shared focused-terminal capability in managed launch, and type
Codex composition overrides against the narrow process and terminal ports they
consume rather than concrete adapters.

## Child checkpoints

- `gate-patterns-inconsistency-launcher-focused-terminal-port`
- `gate-patterns-inconsistency-codex-terminal-override`
- `gate-patterns-inconsistency-codex-process-override`

## Simplification opportunity

Delete one duplicate port declaration and remove two unnecessary concrete-type
dependencies from composition seams. Runtime construction and public behavior
must remain unchanged.

## Acceptance Criteria

- [x] Managed launch imports the canonical focused-terminal capability.
- [x] Codex process and terminal overrides are expressed as narrow ports.
- [x] Existing composition and managed-launch behavior remains unchanged.
- [x] Typecheck, focused tests, build, and the full suite pass.

## Refactor Overview

The runtime already follows narrow capability boundaries, but two compile-time
seams depend on concrete adapters and managed launch duplicates a shared port.
The three edits are intentionally ordered so the canonical port exists at every
step and each commit remains independently typecheckable and reversible.

The bounded direct scan found no larger abstraction worth introducing. The
highest-value move is elimination: delete the duplicate interface, then narrow
the two override types using capabilities that already exist.

## Refactor Steps

### Step 1: Reuse the canonical focused-terminal port

**Priority**: High  
**Risk**: Low  
**Source Lens**: pattern drift / elimination  
**Files**: `src/application/launch-managed-codex.ts`  
**Story**: `gate-patterns-inconsistency-launcher-focused-terminal-port`

**Current State**:

```ts
import type { Clock, LauncherLivenessPort, ReconciliationTerminalPort, SessionStore } from "../domain/ports.js";

export interface FocusedTerminalPort {
  focused(): Promise<import("../domain/session.js").TerminalIdentity | null>;
}
```

**Target State**:

```ts
import type {
  Clock,
  FocusedTerminalPort,
  LauncherLivenessPort,
  ReconciliationTerminalPort,
  SessionStore,
} from "../domain/ports.js";
```

**Implementation Notes**:

- Remove only the local interface and import the existing shared capability.
- Do not alter `ManagedLaunchDependencies` or runtime calls.

**Acceptance Criteria**:

- [x] No local `FocusedTerminalPort` declaration remains.
- [x] Managed-launch tests and typecheck pass unchanged.

**Rollback**: Revert the single import/declaration commit.

### Step 2: Narrow the terminal override to consumed ports

**Priority**: Medium  
**Risk**: Low  
**Source Lens**: pattern drift  
**Files**: `src/composition/create-agent-codex.ts`  
**Story**: `gate-patterns-inconsistency-codex-terminal-override`

**Current State**:

```ts
terminal?: GhosttyClient & RegistrationTerminalPort & ReconciliationTerminalPort;
```

**Target State**:

```ts
terminal?: RegistrationTerminalPort & ReconciliationTerminalPort & FocusedTerminalPort;
```

**Implementation Notes**:

- Keep `GhosttyClient` as the production default value, not as the override
  contract.
- Reuse the canonical `FocusedTerminalPort` established in Step 1.

**Acceptance Criteria**:

- [x] A port-only terminal fake satisfies the composition option.
- [x] Existing `agent-codex` composition behavior and tests are unchanged.

**Rollback**: Revert the type-only composition change.

### Step 3: Narrow the process override to managed-launch capability

**Priority**: Medium  
**Risk**: Low  
**Source Lens**: pattern drift  
**Files**: `src/composition/create-agent-codex.ts`  
**Story**: `gate-patterns-inconsistency-codex-process-override`

**Current State**:

```ts
processes?: CodexProcessHost;
```

**Target State**:

```ts
processes?: ManagedLaunchDependencies["processes"];
```

**Implementation Notes**:

- Retain `CodexProcessHost` as the default constructor.
- Do not introduce a second process-port declaration.

**Acceptance Criteria**:

- [x] The override exposes exactly the process methods managed launch consumes.
- [x] Typecheck, composition tests, build, and the full suite pass.

**Rollback**: Revert the type-only composition change.

## Implementation Order

1. `gate-patterns-inconsistency-launcher-focused-terminal-port`
2. `gate-patterns-inconsistency-codex-terminal-override`
3. `gate-patterns-inconsistency-codex-process-override`

## Design decisions

- **Fanout**: direct-read design only; the bounded two-file surface leaves no
  distinct exploratory unknown worth delegating.
- **Compatibility**: no public or runtime contract changes. Each step changes
  TypeScript ownership only and uses existing capability shapes.

## Implementation notes

Implemented the three ordered type-boundary reconciliations:

1. Managed launch now imports `FocusedTerminalPort` from `domain/ports.ts` and
   no longer redeclares it locally.
2. `createAgentCodexCommand` accepts the narrow registration, reconciliation,
   and focused-terminal port intersection while retaining `GhosttyClient` as
   its production default.
3. Its process override is now `ManagedLaunchDependencies["processes"]`, while
   `CodexProcessHost` remains the production default.

The changes are behavior-preserving and landed as the three child commits:

- `dec2b0e` — `gate-patterns-inconsistency-launcher-focused-terminal-port`
- `db76145` — `gate-patterns-inconsistency-codex-terminal-override`
- `64acace` — `gate-patterns-inconsistency-codex-process-override`

## Verification

- Managed-launch focused tests: 10 passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm test` passed.

## Review (2026-08-16)

**Verdict**: Approve

**Blockers**: none
**Important**: none
**Nits**: none
**Rejected**: none

**Notes**: Standard review weight; exactly one same-harness fresh-context pass.
The reviewer confirmed canonical shared-port reuse, narrow terminal/process
override contracts, unchanged production defaults, no runtime or supported CLI
behavior change, and no foundation assertion drift. Verification was green:
10/10 focused managed-launch tests and 202 full-suite tests (200 passed, 2
intentional skips).
