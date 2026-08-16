---
id: gate-cruft-list-sessions-test-unused-terminal-identity-import
kind: story
stage: implementing
tags: [cleanup]
parent: null
depends_on: []
release_binding: null
gate_origin: cruft
created: 2026-08-16
updated: 2026-08-16
---

# Remove the unused list-sessions TerminalIdentity import

## Confidence

High

## Category

unused import

## Location

`tests/application/list-sessions.test.ts:7`

## Evidence

```typescript
import { SCHEMA_VERSION, type SessionRecord, type TerminalIdentity } from "../../src/domain/session.js";
```

TypeScript reports TS6133 because `TerminalIdentity` has no use beyond this import.

## Removal

Remove the `TerminalIdentity` type specifier while retaining `SCHEMA_VERSION` and `SessionRecord`.
