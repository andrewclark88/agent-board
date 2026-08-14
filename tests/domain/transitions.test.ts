import assert from "node:assert/strict";
import { test } from "node:test";

import { AgentBoardError } from "../../src/domain/errors.js";
import { SCHEMA_VERSION, type SessionRecord } from "../../src/domain/session.js";
import {
  AgentTransitionSchema,
  applyAgentTransition,
  parseAgentTransition,
  type AgentTransition,
} from "../../src/domain/transitions.js";

const at = "2026-08-14T18:00:00Z";

function record(): SessionRecord {
  return {
    schemaVersion: SCHEMA_VERSION,
    revision: 7,
    sessionId: "session-1",
    identity: { projectLabel: "agent-board", repoPath: "/repo", createdAt: at },
    terminal: {
      adapter: "ghostty", windowId: "window-1", tabId: "tab-1", terminalId: "terminal-1",
      presence: "visible", observedAt: at,
    },
    agent: {
      adapter: "codex", mode: "managed", nativeThreadId: "thread-1", launcherPid: 12,
      activity: "idle", attention: "none", health: "live", observedAt: at,
      evidenceKind: "initial", confidence: "authoritative",
    },
  };
}

const evidence = { observedAt: "2026-08-14T18:01:00Z", evidenceKind: "native", confidence: "authoritative" as const };

test("closed transition schema rejects unknown fields and malformed evidence", () => {
  assert.equal(AgentTransitionSchema.safeParse({ type: "working", ...evidence, extra: true }).success, false);
  assert.throws(
    () => parseAgentTransition({ type: "working", ...evidence, observedAt: "later" }),
    (error: unknown) => error instanceof AgentBoardError && error.code === "INVALID_RECORD",
  );
});

test("transitions update only normalized agent state and preserve identity/terminal", () => {
  const current = record();
  const cases: Array<[AgentTransition, Partial<SessionRecord["agent"]>]> = [
    [{ type: "working", ...evidence }, { activity: "working", attention: "none", health: "live" }],
    [{ type: "idle", ...evidence }, { activity: "idle", attention: "none", health: "live" }],
    [{ type: "input-required", ...evidence }, { activity: "idle", attention: "input_required", health: "live" }],
    [{ type: "input-resolved", ...evidence }, { activity: "working", attention: "none", health: "live" }],
    [{ type: "completed", ...evidence }, { activity: "idle", attention: "completion_unread", health: "live" }],
    [{ type: "error", ...evidence }, { activity: "idle", attention: "none", health: "error" }],
    [{ type: "process-exit", ...evidence, exitCode: 0 }, { activity: "idle", attention: "none", health: "live" }],
  ];

  for (const [transition, expected] of cases) {
    const next = applyAgentTransition(current, transition);
    assert.deepEqual({ activity: next.agent.activity, attention: next.agent.attention, health: next.agent.health }, expected);
    assert.equal(next.revision, current.revision);
    assert.equal(next.sessionId, current.sessionId);
    assert.deepEqual(next.identity, current.identity);
    assert.deepEqual(next.terminal, current.terminal);
    assert.equal(next.agent.evidenceKind, "native");
    assert.equal(next.agent.observedAt, evidence.observedAt);
  }
});

test("input-required attention is cleared only by input-resolved", () => {
  const waiting = applyAgentTransition(record(), { type: "input-required", ...evidence });
  const working = applyAgentTransition(waiting, { type: "working", ...evidence });
  const completed = applyAgentTransition(waiting, { type: "completed", ...evidence });
  assert.equal(working.agent.attention, "input_required");
  assert.equal(completed.agent.attention, "input_required");
  assert.equal(applyAgentTransition(waiting, { type: "input-resolved", ...evidence }).agent.attention, "none");
});

test("working clears completion unread while ordinary idle and process exit preserve it", () => {
  const completed = applyAgentTransition(record(), { type: "completed", ...evidence });
  assert.equal(applyAgentTransition(completed, { type: "idle", ...evidence }).agent.attention, "completion_unread");
  assert.equal(applyAgentTransition(completed, { type: "process-exit", ...evidence, exitCode: 0 }).agent.attention, "completion_unread");
  assert.equal(applyAgentTransition(completed, { type: "working", ...evidence }).agent.attention, "none");
});

test("clean process exit does not invent an error or stale health", () => {
  const exited = applyAgentTransition(record(), { type: "process-exit", ...evidence, exitCode: 0, detail: "TUI exited cleanly" });
  assert.equal(exited.agent.activity, "idle");
  assert.equal(exited.agent.health, "live");
  assert.equal(exited.agent.evidenceKind, "native");
  assert.equal(exited.agent.detail, "TUI exited cleanly");
});
