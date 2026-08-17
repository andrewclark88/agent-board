---
id: story-repair-quality-checkpoint-documentation-truth
kind: story
stage: implementing
tags: [prose]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Repair quality-checkpoint documentation truth

## Brief

Resolve the two blocking findings from `doc-review-report.md` without changing
runtime behavior. Align the documented persisted-session field names with the
strict camelCase schema implemented in `src/domain/session.ts`, and correct the
completed packaged-E2E feature record so it no longer declares the nonexistent
`tests/e2e/support/scenario.ts` helper as a delivered artifact.

## Simplification opportunity

Keep one exact persisted-schema representation in the architecture and make
conceptual terminology in the specification explicitly non-serialized. Record
the packaged scenario responsibility where it actually lives instead of
creating a ceremonial helper solely to satisfy an obsolete plan.

## Acceptance Criteria

- [ ] `docs/ARCHITECTURE.md` reproduces the current strict persisted-record
      field names exactly.
- [ ] `docs/SPEC.md` cannot be mistaken for a second serialized field-name
      contract.
- [ ] The completed packaged-E2E feature names only artifacts that exist and
      records how the planned scenario responsibility was consolidated.
- [ ] A fresh documentation audit no longer reports either blocking finding.
