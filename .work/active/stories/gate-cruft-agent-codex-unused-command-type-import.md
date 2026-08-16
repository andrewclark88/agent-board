---
id: gate-cruft-agent-codex-unused-command-type-import
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

# Remove the unused AgentCodexCommand type import

## Confidence

High

## Category

unused import

## Location

`src/cli/agent-codex.ts:4`

## Evidence

```typescript
import { createAgentCodexCommand, type AgentCodexCommand } from "../composition/create-agent-codex.js";
```

TypeScript reports TS6133 because `AgentCodexCommand` has no use beyond this import.

## Removal

Remove the `AgentCodexCommand` type specifier while retaining `createAgentCodexCommand`.
