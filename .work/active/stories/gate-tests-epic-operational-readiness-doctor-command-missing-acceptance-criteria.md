---
id: gate-tests-epic-operational-readiness-doctor-command-missing-acceptance-criteria
kind: story
stage: drafting
tags: [testing, research-pipeline-extension]
parent: feature-adjudicate-acceptance-format-findings
depends_on: []
release_binding: null
gate_origin: tests
created: 2026-08-16
updated: 2026-08-16
---

# Normalize acceptance criteria for epic-operational-readiness-doctor-command

## Priority

Medium

## Value evidence

Item: `epic-operational-readiness-doctor-command`

Contract / risk / regression / maintenance cost: The recognized acceptance heading contains only bare bullets at lines 177–183, so the deterministic checkbox parser returns zero criteria. Evidence: `.work/active/features/epic-operational-readiness-doctor-command.md:175`.

## Gap type

missing-acceptance-criteria

## Recommended edit

Convert the acceptance bullets to `- [ ]` checkboxes.

## Test location (suggested)

`.work/active/features/epic-operational-readiness-doctor-command.md:175`
