---
id: story-fix-codex-loaded-thread-schema
kind: story
stage: review
tags: [bug, integration]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Adapt managed discovery to Codex's loaded-thread schema

A newly launched managed Codex session started normally, then immediately
returned to the shell with an error projection. Its persisted evidence was
`codex.launcher.failure` with detail `Codex app-server response failed schema
validation`.

## Root cause

Codex 0.147's generated app-server schema defines `thread/loaded/list` as a
list of thread-id strings. Agent Board still validates each entry as a full
thread object, so any non-empty loaded list fails validation and tears down the
managed TUI. The current protocol exposes the required thread metadata through
`thread/read`.

## Repair

- Validate the loaded-list wire response as thread IDs.
- Read each loaded thread with `thread/read` and return the same enriched
  internal result expected by thread binding.
- Keep the existing subscribe-before-discovery ordering and strict response
  validation.
- Update the packaged fake Codex and protocol tests to match the installed
  Codex contract.
- Include the request method in response-validation failures so future protocol
  drift is diagnosable from persisted session evidence.

## Regression evidence

`tests/integrations/codex/client.test.ts` now models the current wire contract.
Before the repair it fails with `Invalid input: expected object, received
string` at `data[0]`, matching the live session failure.

## Acceptance

- A non-empty `thread/loaded/list` response containing IDs is enriched through
  `thread/read` without dropping the managed session.
- Malformed loaded-list and thread-read responses still fail closed.
- Existing thread binding, notification ordering, lifecycle, and packaged E2E
  coverage remain green.

## Implementation notes

- Split the wire response from the enriched internal discovery result:
  `thread/loaded/list` validates ID strings and `thread/read` supplies each
  thread's status, cwd, and parent metadata.
- Reads are sequential and omit turns, keeping pending work bounded and
  preserving loaded-list order. A mismatched returned thread ID fails closed.
- Response-schema failures now name the request method in durable launcher
  evidence.
- Updated the packaged fake Codex and the opt-in installed schema probe. The
  latter passed against Codex 0.147.0 and now guards both loaded-list IDs and
  the thread-read response surface.
- Repaired two timing bugs in the loopback client fixture uncovered by repeated
  runs: notifications now start after the subscription-owning request, overflow
  is established before its response resolves, and fixture teardown is bounded.
- Verification: focused protocol/client/binding/lifecycle tests pass; the
  client suite passed 20 consecutive runs; packaged E2E passes; typecheck and
  build pass; the full hermetic suite passes 192 tests with 2 opt-in probes
  skipped.
