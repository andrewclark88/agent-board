---
id: epic-operational-readiness-packaged-e2e-infra
kind: story
stage: implementing
tags: [e2e-test, testing]
parent: epic-operational-readiness-packaged-e2e
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Package harness and executable services

Implement Unit 1 from the parent feature: packed temporary-prefix installation,
bounded bin/process helpers, isolated scenario state, fake Codex/Ghostty CLI/
AppleScript executable services, and the narrow validated production command
override seam.

Acceptance:

- A source-free installed prefix exposes and runs all four bins.
- Product processes use only argv-based configured mock executables and the
  temporary state root; production defaults remain unchanged.
- Setup/readiness/teardown are bounded, hermetic, and cannot clean outside the
  recorded temp root.

Test integrity: park real product bugs with a linked skipped failing test; fix
bad fixtures in-session; never game an assertion or assert only mock calls.
