---
id: gate-cruft-register-session-test-unused-domain-imports
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

# Remove unused register-session domain imports

## Confidence

High

## Category

unused import

## Location

`tests/application/register-session.test.ts:16`

## Evidence

```typescript
import { SCHEMA_VERSION, type SessionRecord, type TerminalIdentity } from "../../src/domain/session.js";
```

TypeScript reports TS6133 for both `SCHEMA_VERSION` and `SessionRecord`; neither has a use beyond this import.

## Removal

Remove `SCHEMA_VERSION` and `SessionRecord`, reducing the declaration to a type-only import of `TerminalIdentity`.
