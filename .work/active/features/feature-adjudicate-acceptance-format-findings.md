---
id: feature-adjudicate-acceptance-format-findings
kind: feature
stage: done
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
defects: preserve both completed current records and immutable archived history,
and disposition every child finding with explicit evidence.

## Child findings

All active `gate-tests-*-missing-acceptance-criteria` stories belong to this
feature. Their source records remain the evidence; the feature owns the common
adjudication policy and integrated verification.

## Simplification opportunity

Replace 42 unrelated active queue entries with one coherent evidence-backed
resolution. Do not manufacture ceremonial criteria, rewrite Git history, or
duplicate acceptance evidence already present in completed item bodies.

## Acceptance Criteria

- [x] Every child finding is classified as a current completed record or an
      archived historical record.
- [x] Completed current records remain unchanged; the findings explain why no
      post-hoc criteria are appropriate.
- [x] Archived historical bodies remain unchanged; their findings record why
      Git history is authoritative and no rewrite is appropriate.
- [x] All 42 child findings reach `done` with a concise disposition.
- [x] The feature records totals by disposition and reaches review with a clean
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

## Adjudication summary

- Result: all 42 findings are retroactive parser-format false positives, not
  product defects.
- Source classes: 28 current completed records and 14 archived historical
  records.
- Existing evidence: 13 bodies already contain 150 checkboxes under unsupported
  bold labels; the remaining records likewise carry completed delivery and
  verification evidence in formats introduced before the stricter grammar.
- Action: 0 source or history rewrites and no post-hoc acceptance criteria.

## Verification

- All 42 direct child stories are `done`; none remains at `drafting`.
- Each child records its source class, existing delivery/verification evidence,
  later parser-grammar timing, and the no-rewrite disposition.
- The changed-path comparison contains only the 42 child findings and this
  feature; every referenced current record and archived historical record is
  untouched.

## Review (2026-08-16)

**Verdict**: Approve

**Blockers**: none
**Important**: none
**Nits**: none
**Rejected**: none

**Notes**: Standard review weight; exactly one same-harness fresh-context pass.
The reviewer independently confirmed all 42 child dispositions, the 28 current
/ 14 archived classification, the 13-body / 150-checkbox evidence, and zero
source or history rewrites. Runtime, security, and code-test lenses were
inapplicable to this prose-only substrate adjudication.
