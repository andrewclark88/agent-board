---
id: story-fix-codex-0-154-compatibility
kind: story
stage: review
tags: [bug, integration, cli]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-09-12
updated: 2026-09-12
---

# Restore managed launch after upgrading to Codex 0.154

## Symptom

After updating Codex, Agent Board no longer works. Installed `codex --version`
reports `codex-cli 0.154.0`. The linked `agent-board doctor` exits 1 with
`CODEX_VERSION_UNSUPPORTED: Installed Codex is incompatible with managed observation`
and recommends a supported family ending at `0.153.x`.

## Root cause

`src/integrations/codex/compatibility.ts` explicitly accepts tested Codex minor
families, but its list ends at 153. Both doctor and managed launch share this
gate, which rejects 0.154.0 before starting the app-server. The existing installed
generated-schema probe passes on 0.154.0; the reported failure is the stale
compatibility boundary.

## Fix approach

Verify the installed protocol and existing lifecycle fixtures, then add only
0.154.x to the tested families. Preserve the 0.151.x exclusion and rejection of
unverified future families. Refresh compatibility guidance, rebuild the linked
local commands, and deliver repository changes through a pull request.

## Regression test

`tests/integrations/codex/endpoint.test.ts` now accepts `codex-cli 0.154.0`
and rejects the next unverified family, 0.155.x. Before the fix it failed with
`compatible: false` / `reasonCode: unsupported` instead of the expected acceptance.

## Verification

- Before the fix, `agent-board doctor`: exit 1, `CODEX_VERSION_UNSUPPORTED`.
- Before the fix, updated endpoint regression: 7 pass, 1 fail on 0.154.0.
- Installed schema probe on Codex 0.154.0: 1 pass, no skips.
- `npm run typecheck`: passed.
- `AGENT_BOARD_LIVE_CODEX=1 npm test`: 231 tests, 229 passed, zero failures,
  two intentional opt-in skips (installed Claude and disposable Ghostty).
  Includes the acceptance regression, captured lifecycle fixtures, process
  supervision, and packaged CLI journeys.
- Real installed 0.154.0 smoke using `CodexProcessHost` and `AppServerClient`:
  accepted version, started a loopback app-server, parsed its endpoint,
  initialized over WebSocket, and read its empty loaded-thread list. Closed
  the connection and terminated the owned child successfully. No model turn ran.
- Rebuilt linked `agent-board doctor`: exit 0, `CODEX_COMPATIBLE` for 0.154.0,
  all checks green, `Ready.` The global npm package links to this checkout,
  so the build updates the user's installed commands without reinstalling.

The [official app-server documentation](https://learn.chatgpt.com/docs/app-server#message-schema)
describes generating version-specific schemas from the installed CLI. Protocol
values and captured lifecycle fixtures remain compatible; no protocol parser
or fixture-shape change is needed. A live model turn and visual TUI behavior
were not part of this verification.

## Implementation notes

Execution capability: one local owner for this focused compatibility fix and
bounded inline story review. The documentation skill delegates its four related
guidance edits to one worker; this is not an independent story review.

Changed the shared compatibility set and diagnostic family string, extended the
endpoint regression, refreshed README/architecture/configuration/example guidance,
and regenerated knowledge indexes. No adjacent production bugs surfaced in the
test pass; no additional bug items were needed.
