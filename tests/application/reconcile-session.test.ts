import assert from "node:assert/strict";
import { test } from "node:test";

import { reconcileSession, reconcileSessions, classifyTerminalPresence } from "../../src/application/reconcile-session.js";
import { AgentBoardError } from "../../src/domain/errors.js";
import type { ReconciliationTerminalPort, SessionStore, TerminalSnapshot } from "../../src/domain/ports.js";
import { SCHEMA_VERSION, type SessionRecord, type TerminalIdentity } from "../../src/domain/session.js";

const at = "2026-08-14T23:00:00.000Z";
const later = "2026-08-14T23:01:00.000Z";
const identity = { adapter: "ghostty" as const, windowId: "w", tabId: "t", terminalId: "term" };

function record(sessionId: string, terminal: Partial<SessionRecord["terminal"]> = {}, agent: Partial<SessionRecord["agent"]> = {}): SessionRecord {
  const completionObservedAt = agent.attention === "completion_unread" ? at : undefined;
  return {
    schemaVersion: SCHEMA_VERSION, revision: 0, sessionId,
    identity: { projectLabel: sessionId, createdAt: at },
    terminal: { ...identity, presence: "visible", observedAt: at, ...terminal },
    agent: { adapter: "codex", mode: "ordinary", activity: "idle", attention: "none", health: "live", observedAt: at, evidenceKind: "test", confidence: "authoritative", ...agent, ...(completionObservedAt === undefined ? {} : { completionObservedAt }) },
  };
}

class MemoryStore implements SessionStore {
  readonly records = new Map<string, SessionRecord>();
  constructor(values: readonly SessionRecord[]) { for (const value of values) this.records.set(value.sessionId, structuredClone(value)); }
  async get(id: string) { return structuredClone(this.records.get(id) ?? null); }
  async list() { return [...this.records.values()].sort((a, b) => a.sessionId.localeCompare(b.sessionId)).map((value) => structuredClone(value)); }
  async create(value: SessionRecord) { this.records.set(value.sessionId, structuredClone(value)); return structuredClone(value); }
  async mutate(id: string, mutation: (current: Readonly<SessionRecord>) => SessionRecord) {
    const current = this.records.get(id);
    if (!current) throw new AgentBoardError("NOT_FOUND", id);
    const next = mutation(structuredClone(current));
    const saved = { ...structuredClone(next), revision: current.revision + 1 };
    this.records.set(id, saved);
    return structuredClone(saved);
  }
  async remove(id: string) { this.records.delete(id); }
}

class FakeTerminal implements ReconciliationTerminalPort {
  snapshotCalls = 0;
  readonly titles: Array<{ identity: TerminalIdentity; title: string }> = [];
  readonly clears: TerminalIdentity[] = [];
  constructor(private readonly value: TerminalSnapshot, private readonly titleError?: unknown) {}
  async snapshot() { this.snapshotCalls += 1; return this.value; }
  async setTitle(value: TerminalIdentity, title: string) {
    if (this.titleError !== undefined) throw this.titleError;
    this.titles.push({ identity: value, title });
  }
  async clearTitle(value: TerminalIdentity) { this.clears.push(value); }
}

const dependencies = (store: SessionStore, terminal: ReconciliationTerminalPort) => ({
  store, terminal, clock: { now: () => new Date(later) }, workingFreshForMs: 60_000,
});

function snapshot(...entries: readonly TerminalIdentity[]): TerminalSnapshot {
  return { visible: entries, enumerableTerminalIds: entries.map((entry) => entry.terminalId) };
}

test("presence classification refreshes moved ancestry and distinguishes hidden from missing", () => {
  const moved = { ...identity, windowId: "w2", tabId: "t9" };
  assert.deepEqual(classifyTerminalPresence(identity, snapshot(moved), later), { ...moved, presence: "visible", observedAt: later });
  assert.equal(classifyTerminalPresence(identity, { visible: [], enumerableTerminalIds: [identity.terminalId] }, later).presence, "hidden");
  assert.equal(classifyTerminalPresence(identity, { visible: [], enumerableTerminalIds: [] }, later).presence, "missing");
  assert.throws(() => classifyTerminalPresence(identity, { visible: [moved, moved], enumerableTerminalIds: [identity.terminalId] }, later), /Duplicate visible/);
});

test("all-session reconciliation takes one snapshot and renders only verified visible records", async () => {
  const store = new MemoryStore([
    record("a", {}, { activity: "working" }),
    record("b", {}, { attention: "completion_unread" }),
  ]);
  const terminal = new FakeTerminal(snapshot(identity));
  const results = await reconcileSessions(dependencies(store, terminal));
  assert.equal(terminal.snapshotCalls, 1);
  assert.deepEqual(results.map((result) => result.record.sessionId), ["a", "b"]);
  assert.deepEqual(terminal.titles.map((entry) => entry.title), ["● a", "✓ b"]);
  assert.equal((await store.get("a"))?.agent.activity, "working");
});

test("hidden and missing records are diagnostic and receive no title write", async () => {
  const store = new MemoryStore([
    record("hidden", {}, { attention: "input_required" }),
    record("missing", {}, { activity: "working" }),
  ]);
  const terminal = new FakeTerminal({ visible: [], enumerableTerminalIds: [identity.terminalId] });
  const hidden = await reconcileSession(dependencies(store, terminal), "hidden");
  assert.equal(hidden.titleRendered, false);
  assert.equal(hidden.record.terminal.presence, "hidden");
  assert.equal(terminal.titles.length, 0);
  const missingTerminal = new FakeTerminal({ visible: [], enumerableTerminalIds: [] });
  const missing = await reconcileSession(dependencies(store, missingTerminal), "missing");
  assert.equal(missing.record.terminal.presence, "missing");
  assert.equal(missing.titleRendered, false);
});

test("snapshot failure records unknown for a single session and rethrows", async () => {
  const store = new MemoryStore([record("a")]);
  const terminal: ReconciliationTerminalPort = {
    async snapshot() { throw new AgentBoardError("ADAPTER_FAILURE", "disconnected"); },
    async setTitle() {}, async clearTitle() {},
  };
  await assert.rejects(reconcileSession(dependencies(store, terminal), "a"), /disconnected/);
  assert.equal((await store.get("a"))?.terminal.presence, "unknown");
});

test("target disappearing during title write is demoted to unknown", async () => {
  const store = new MemoryStore([record("a")]);
  const terminal = new FakeTerminal(snapshot(identity), { ghosttyCode: "GHOSTTY_TARGET_NOT_FOUND" });
  await assert.rejects(reconcileSession(dependencies(store, terminal), "a"));
  assert.equal((await store.get("a"))?.terminal.presence, "unknown");
});
