---
id: feature-adjudicate-acceptance-format-findings
kind: feature
stage: implementing
tags: [prose]
parent: null
depends_on: []
release_binding: null
gate_origin: tests
created: 2026-08-16
updated: 2026-08-16
---

# Adjudicate acceptance-format findings

## Brief

Consolidate the 42 Medium test-gate findings produced because historical and
current work records use acceptance prose that the gate's narrow Markdown
parser does not recognize. Treat this as substrate hygiene, not as 42 product
defects: preserve immutable archived history, normalize current records only
where doing so adds durable value, and disposition every child finding with
explicit evidence.

## Child findings

All active `gate-tests-*-missing-acceptance-criteria` stories belong to this
feature. Their source records remain the evidence; the feature owns the common
adjudication policy and integrated verification.

## Simplification opportunity

Replace 42 unrelated active queue entries with one coherent evidence-backed
resolution. Do not manufacture ceremonial criteria, rewrite Git history, or
duplicate acceptance evidence already present in completed item bodies.

## Acceptance Criteria

- [ ] Every child finding is classified as a current-record normalization or
      an immutable historical-format false positive.
- [ ] Current records are edited only when canonical headings improve future
      machine readability without falsifying completed work.
- [ ] Archived historical bodies remain unchanged; their findings record why
      Git history is authoritative and no rewrite is appropriate.
- [ ] All 42 child findings reach `done` with a concise disposition.
- [ ] The feature records totals by disposition and reaches review with a clean
      substrate query.

## Authoring plan

1. Read each source item from the current tree or its archived `git_ref`.
2. Classify the finding by source-record state and existing evidence.
3. Preserve archived history and record those findings as false positives.
4. Normalize a current record only when the edit improves durable parsing.
5. Close each child with its classification and evidence.
6. Record the totals and verify that no child remains active.

The brief is a sufficient specification. This feature has no runtime code,
interface, or architectural decision. It therefore uses the no-coordination
prose lane.
