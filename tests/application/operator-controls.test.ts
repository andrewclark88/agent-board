import assert from "node:assert/strict";
import { test } from "node:test";

import { acknowledgeSession } from "../../src/application/acknowledge-session.js";
import { resolveSessionTarget } from "../../src/application/resolve-session-target.js";
import { AgentBoardError } from "../../src/domain/errors.js";
import type { ReconciliationTerminalPort, SessionStore } from "../../src/domain/ports.js";
import { SCHEMA_VERSION, type SessionRecord, type TerminalIdentity } from "../../src/domain/session.js";

const at = "2026-08-14T23:00:00.000Z";
const identity: TerminalIdentity = { adapter: "ghostty", windowId: "w", tabId: "t", terminalId: "term" };

function record(sessionId = "session-1", terminal: TerminalIdentity = identity, attention: SessionRecord["agent"]["attention"] = "completion_unread"): SessionRecord {
  return {
    schemaVersion: SCHEMA_VERSION,
    revision: 1,
    sessionId,
    identity: { projectLabel: sessionId, createdAt: at },
    terminal: { ...terminal, presence: "visible", observedAt: at },
    agent: {
      adapter: "codex",
      mode: "managed",
      activity: "idle",
      attention,
      ...(attention === "completion_unread" ? { completionObservedAt: at } : {}),
      health: "live",
      observedAt: at,
      evidenceKind: "turn.completed",
      confidence: "authoritative",
    },
  };
}

class MemoryStore implements SessionStore {
  readonly records = new Map<string, SessionRecord>();
  constructor(values: readonly SessionRecord[]) {
    for (const value of values) this.records.set(value.sessionId, structuredClone(value));
  }
  async get(id: string) { return structuredClone(this.records.get(id) ?? null); }
  async list() { return [...this.records.values()].map((value) => structuredClone(value)); }
  async create(value: SessionRecord) { this.records.set(value.sessionId, structuredClone(value)); return structuredClone(value); }
  async mutate(id: string, mutation: (current: Readonly<SessionRecord>) => SessionRecord) {
    const current = this.records.get(id);
    if (current === undefined) throw new AgentBoardError("NOT_FOUND", id);
    const next = mutation(structuredClone(current));
    const saved = { ...structuredClone(next), revision: current.revision + 1 };
    this.records.set(id, saved);
    return structuredClone(saved);
  }
  async remove(id: string) { this.records.delete(id); }
}

class FakeTerminal implements ReconciliationTerminalPort {
  currentCalls = 0;
  snapshotCalls = 0;
  readonly titles: string[] = [];
  constructor(
    private readonly focused: TerminalIdentity = identity,
    private readonly snapshotValue = { visible: [identity], enumerableTerminalIds: [identity.terminalId] },
    private readonly titleError?: unknown,
    private readonly currentError?: unknown,
  ) {}
  async current() {
    this.currentCalls += 1;
    if (this.currentError !== undefined) throw this.currentError;
    return this.focused;
  }
  async snapshot() {
    this.snapshotCalls += 1;
    return this.snapshotValue;
  }
  async setTitle(_value: TerminalIdentity, title: string) {
    if (this.titleError !== undefined) throw this.titleError;
    this.titles.push(title);
  }
  async clearTitle() {}
}

const clock = { now: () => new Date("2026-08-14T23:01:00.000Z") };

test("explicit target resolves by exact full id without consulting focus", async () => {
  const store = new MemoryStore([record()]);
  const terminal = new FakeTerminal();
  const result = await resolveSessionTarget(store, terminal, "session-1");
  assert.equal(result.sessionId, "session-1");
  assert.equal(terminal.currentCalls, 0);
});

test("unknown explicit target and unregistered focus are visible failures", async () => {
  const store = new MemoryStore([record()]);
  await assert.rejects(
    resolveSessionTarget(store, new FakeTerminal(), "missing"),
    (error: unknown) => error instanceof AgentBoardError && error.code === "NOT_FOUND",
  );
  await assert.rejects(
    resolveSessionTarget(store, new FakeTerminal({ ...identity, terminalId: "other" })),
    (error: unknown) => error instanceof AgentBoardError && error.code === "NOT_FOUND",
  );
});

test("focused resolution rejects duplicate identities instead of choosing an order", async () => {
  const duplicate = record("session-2");
  const store = new MemoryStore([record(), duplicate]);
  await assert.rejects(
    resolveSessionTarget(store, new FakeTerminal()),
    (error: unknown) => error instanceof AgentBoardError && error.code === "CONFLICT",
  );
});

test("focused adapter failures propagate without becoming NOT_FOUND", async () => {
  const adapterFailure = new AgentBoardError("ADAPTER_FAILURE", "Ghostty unavailable");
  await assert.rejects(
    resolveSessionTarget(new MemoryStore([record()]), new FakeTerminal(identity, undefined, undefined, adapterFailure)),
    (error: unknown) => error === adapterFailure,
  );
});

test("acknowledgement clears unread state and reconciles the title", async () => {
  const store = new MemoryStore([record()]);
  const terminal = new FakeTerminal();
  const result = await acknowledgeSession({ store, terminal, clock, workingFreshForMs: 60_000 }, "session-1");
  assert.equal(result.record.agent.attention, "none");
  assert.equal(result.titleRendered, true);
  assert.deepEqual(terminal.titles, ["○ session-1"]);
});

test("input-required acknowledgement remains unchanged while title still converges", async () => {
  const store = new MemoryStore([record("session-1", identity, "input_required")]);
  const terminal = new FakeTerminal();
  const result = await acknowledgeSession({ store, terminal, clock, workingFreshForMs: 60_000 }, "session-1");
  assert.equal(result.record.agent.attention, "input_required");
  assert.equal(result.titleRendered, true);
  assert.deepEqual(terminal.titles, ["! session-1"]);
});

test("title failure is deferred after durable acknowledgement", async () => {
  const store = new MemoryStore([record()]);
  const terminal = new FakeTerminal(identity, undefined, new AgentBoardError("ADAPTER_FAILURE", "title failed"));
  const result = await acknowledgeSession({ store, terminal, clock, workingFreshForMs: 60_000 }, "session-1");
  assert.equal(result.titleRendered, false);
  assert.equal(result.record.agent.attention, "none");
  assert.equal((await store.get("session-1"))?.agent.attention, "none");
});

test("snapshot failure remains a visible acknowledgement failure", async () => {
  const store = new MemoryStore([record()]);
  const terminal = new FakeTerminal();
  terminal.snapshot = async () => { throw new AgentBoardError("ADAPTER_FAILURE", "snapshot failed"); };
  await assert.rejects(
    acknowledgeSession({ store, terminal, clock, workingFreshForMs: 60_000 }, "session-1"),
    /snapshot failed/,
  );
  assert.equal((await store.get("session-1"))?.agent.attention, "none");
});
