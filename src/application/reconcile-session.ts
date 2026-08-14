import { AgentBoardError } from "../domain/errors.js";
import type {
  Clock,
  ReconciliationTerminalPort,
  SessionStore,
  TerminalSnapshot,
} from "../domain/ports.js";
import {
  ObservationSchema,
  TerminalIdentitySchema,
  TerminalObservationSchema,
  type SessionRecord,
  type TerminalIdentity,
  type TerminalObservation,
} from "../domain/session.js";
import { projectSession } from "../domain/projection.js";
import { renderSessionTitle } from "./render-title.js";

export interface ReconcileDependencies {
  readonly store: SessionStore;
  readonly terminal: ReconciliationTerminalPort;
  readonly clock: Clock;
  readonly workingFreshForMs: number;
}

export interface ReconcileResult {
  readonly record: SessionRecord;
  readonly titleRendered: boolean;
}

function timestamp(clock: Clock): string {
  const now = clock.now();
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new AgentBoardError("INVALID_RECORD", "Clock returned an invalid Date");
  }
  const observedAt = now.toISOString();
  const parsed = ObservationSchema.safeParse({
    observedAt,
    evidenceKind: "ghostty.reconciliation",
    confidence: "authoritative",
  });
  if (!parsed.success) {
    throw new AgentBoardError("INVALID_RECORD", "Clock produced an invalid reconciliation timestamp", { cause: parsed.error });
  }
  return observedAt;
}

function sameIdentity(left: TerminalIdentity, right: TerminalIdentity): boolean {
  return left.adapter === right.adapter &&
    left.windowId === right.windowId &&
    left.tabId === right.tabId &&
    left.terminalId === right.terminalId;
}

function identityOf(record: SessionRecord): TerminalIdentity {
  return {
    adapter: record.terminal.adapter,
    windowId: record.terminal.windowId,
    tabId: record.terminal.tabId,
    terminalId: record.terminal.terminalId,
  };
}

function validateSnapshot(input: TerminalSnapshot): TerminalSnapshot {
  if (input === null || typeof input !== "object" ||
      !Array.isArray(input.visible) || !Array.isArray(input.enumerableTerminalIds)) {
    throw new AgentBoardError("INVALID_RECORD", "Invalid Ghostty terminal snapshot");
  }
  const visible: TerminalIdentity[] = [];
  const visibleIds = new Set<string>();
  for (const candidate of input.visible) {
    const parsed = TerminalIdentitySchema.safeParse(candidate);
    if (!parsed.success) throw new AgentBoardError("INVALID_RECORD", "Invalid visible terminal identity", { cause: parsed.error });
    if (visibleIds.has(parsed.data.terminalId)) {
      throw new AgentBoardError("INVALID_RECORD", `Duplicate visible terminal ID ${parsed.data.terminalId}`);
    }
    visibleIds.add(parsed.data.terminalId);
    visible.push(parsed.data);
  }
  const enumerableTerminalIds: string[] = [];
  const enumerableIds = new Set<string>();
  for (const candidate of input.enumerableTerminalIds) {
    if (typeof candidate !== "string" || candidate.length === 0 || /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/u.test(candidate)) {
      throw new AgentBoardError("INVALID_RECORD", "Invalid enumerable terminal ID");
    }
    if (enumerableIds.has(candidate)) throw new AgentBoardError("INVALID_RECORD", `Duplicate enumerable terminal ID ${candidate}`);
    enumerableIds.add(candidate);
    enumerableTerminalIds.push(candidate);
  }
  for (const terminalId of visibleIds) {
    if (!enumerableIds.has(terminalId)) throw new AgentBoardError("INVALID_RECORD", `Visible terminal ${terminalId} is not enumerable`);
  }
  return { visible, enumerableTerminalIds };
}

/** Purely classify one registered identity against one validated snapshot. */
export function classifyTerminalPresence(
  registered: TerminalIdentity,
  snapshot: TerminalSnapshot,
  observedAt: string,
): TerminalObservation {
  const identity = TerminalIdentitySchema.safeParse(registered);
  if (!identity.success) throw new AgentBoardError("INVALID_RECORD", "Invalid registered terminal identity", { cause: identity.error });
  const checked = validateSnapshot(snapshot);
  const timestampResult = TerminalObservationSchema.safeParse({
    ...identity.data,
    presence: "unknown",
    observedAt,
  });
  if (!timestampResult.success) throw new AgentBoardError("INVALID_RECORD", "Invalid terminal observation timestamp", { cause: timestampResult.error });

  const visible = checked.visible.find((candidate) => candidate.terminalId === identity.data.terminalId);
  const presence = visible === undefined
    ? checked.enumerableTerminalIds.includes(identity.data.terminalId) ? "hidden" : "missing"
    : "visible";
  const observation = visible === undefined
    ? { ...identity.data, presence, observedAt }
    : { ...visible, presence, observedAt };
  const parsed = TerminalObservationSchema.safeParse(observation);
  if (!parsed.success) throw new AgentBoardError("INVALID_RECORD", "Invalid classified terminal observation", { cause: parsed.error });
  return parsed.data;
}

function unknownTerminal(current: SessionRecord, observedAt: string): SessionRecord {
  return {
    ...current,
    terminal: { ...current.terminal, presence: "unknown", observedAt },
  };
}

async function persistUnknown(
  dependencies: ReconcileDependencies,
  sessionId: string,
): Promise<SessionRecord> {
  const observedAt = timestamp(dependencies.clock);
  return dependencies.store.mutate(sessionId, (current) => unknownTerminal(current, observedAt));
}

function hasGhosttyCode(error: unknown, code: string, seen = new Set<unknown>()): boolean {
  if (error === null || typeof error !== "object" || seen.has(error)) return false;
  seen.add(error);
  if ((error as { ghosttyCode?: unknown }).ghosttyCode === code) return true;
  return hasGhosttyCode((error as { cause?: unknown }).cause, code, seen);
}

async function reconcileLoaded(
  dependencies: ReconcileDependencies,
  record: SessionRecord,
  snapshot: TerminalSnapshot,
): Promise<ReconcileResult> {
  const observedAt = timestamp(dependencies.clock);
  let updated: SessionRecord;
  try {
    const observation = classifyTerminalPresence(identityOf(record), snapshot, observedAt);
    updated = await dependencies.store.mutate(record.sessionId, (current) => ({
      ...current,
      terminal: observation,
    }));
  } catch (error) {
    await persistUnknown(dependencies, record.sessionId);
    throw error;
  }

  const latest = await dependencies.store.get(record.sessionId);
  if (latest === null) throw new AgentBoardError("NOT_FOUND", `Session not found: ${record.sessionId}`);
  if (updated.terminal.presence !== "visible" || latest.terminal.presence !== "visible") {
    return { record: latest, titleRendered: false };
  }
  const visible = snapshot.visible.find((candidate) => candidate.terminalId === latest.terminal.terminalId);
  if (visible === undefined || !sameIdentity(latest.terminal, visible)) {
    return { record: latest, titleRendered: false };
  }

  try {
    const rendered = await renderSessionTitle(dependencies, record.sessionId, { expectedIdentity: visible });
    return { record: rendered, titleRendered: true };
  } catch (error) {
    if (hasGhosttyCode(error, "GHOSTTY_TARGET_NOT_FOUND")) {
      await persistUnknown(dependencies, record.sessionId);
      throw error;
    }
    throw error;
  }
}

export async function reconcileSession(
  dependencies: ReconcileDependencies,
  sessionId: string,
  suppliedSnapshot?: TerminalSnapshot,
): Promise<ReconcileResult> {
  const record = await dependencies.store.get(sessionId);
  if (record === null) throw new AgentBoardError("NOT_FOUND", `Session not found: ${sessionId}`);
  let snapshot: TerminalSnapshot;
  try {
    snapshot = suppliedSnapshot ?? await dependencies.terminal.snapshot();
    snapshot = validateSnapshot(snapshot);
  } catch (error) {
    const diagnostic = await persistUnknown(dependencies, sessionId);
    if (error instanceof Error) (error as Error & { diagnostic?: SessionRecord }).diagnostic = diagnostic;
    throw error;
  }
  return reconcileLoaded(dependencies, record, snapshot);
}

export async function reconcileSessions(
  dependencies: ReconcileDependencies,
): Promise<readonly ReconcileResult[]> {
  const records = await dependencies.store.list();
  let snapshot: TerminalSnapshot;
  try {
    snapshot = validateSnapshot(await dependencies.terminal.snapshot());
  } catch {
    const results: ReconcileResult[] = [];
    for (const record of records) {
      const diagnostic = await persistUnknown(dependencies, record.sessionId);
      results.push({ record: diagnostic, titleRendered: false });
    }
    return results;
  }

  const results: ReconcileResult[] = [];
  for (const record of records) {
    try {
      results.push(await reconcileLoaded(dependencies, record, snapshot));
    } catch (error) {
      // A target race is a visible diagnostic for this record; other records
      // still receive the same atomic snapshot and should not be abandoned.
      const current = await dependencies.store.get(record.sessionId);
      if (current !== null) results.push({ record: current, titleRendered: false });
      else if (!(error instanceof AgentBoardError && error.code === "NOT_FOUND")) throw error;
    }
  }
  return results;
}
