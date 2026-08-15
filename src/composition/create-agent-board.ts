import { acknowledgeSession, type AcknowledgeSessionDependencies, type AcknowledgeSessionResult } from "../application/acknowledge-session.js";
import { diagnoseSystem, type DoctorDependencies, type DoctorReport } from "../application/doctor.js";
import { unregisterAgentSession, type UnregisterAgentSessionDependencies } from "../application/unregister-agent-session.js";
import type { FocusedTerminalPort, ReconciliationTerminalPort, SessionStore } from "../domain/ports.js";
import type { SessionRecord } from "../domain/session.js";
import { JsonSessionStore } from "../infrastructure/json-session-store.js";
import { StateDirectoryProbe } from "../infrastructure/state-diagnostics.js";
import { CodexProcessHost } from "../integrations/codex/process.js";
import { GhosttyClient } from "../integrations/ghostty/client.js";
import { diagnoseGhostty } from "../integrations/ghostty/diagnostics.js";

export interface AgentBoardCommand {
  readonly ack: (explicitSessionId?: string) => Promise<AcknowledgeSessionResult>;
  readonly unregister: (explicitSessionId?: string) => Promise<SessionRecord>;
  readonly doctor: () => Promise<DoctorReport>;
}

export interface AgentBoardCompositionOptions {
  readonly store?: SessionStore;
  readonly terminal?: ReconciliationTerminalPort & FocusedTerminalPort;
  readonly workingFreshForMs?: number;
  readonly doctorDependencies?: DoctorDependencies;
}

export function createAgentBoardCommand(
  options: AgentBoardCompositionOptions = {},
): AgentBoardCommand {
  const store = options.store ?? new JsonSessionStore();
  const terminal = options.terminal ?? new GhosttyClient();
  const clock = { now: () => new Date() };
  const workingFreshForMs = options.workingFreshForMs ?? 60_000;
  const acknowledgeDependencies: AcknowledgeSessionDependencies = {
    store,
    terminal,
    clock,
    workingFreshForMs,
  };
  const unregisterDependencies: UnregisterAgentSessionDependencies = {
    store,
    terminal,
    clock,
  };
  const doctorDependencies = options.doctorDependencies ?? {
    clock,
    nodeVersion: process.versions.node,
    state: new StateDirectoryProbe(),
    codex: new CodexProcessHost(),
    ghostty: () => diagnoseGhostty(),
  } satisfies DoctorDependencies;
  return {
    ack: (explicitSessionId) => acknowledgeSession(acknowledgeDependencies, explicitSessionId),
    unregister: (explicitSessionId) => unregisterAgentSession(unregisterDependencies, explicitSessionId),
    doctor: () => diagnoseSystem(doctorDependencies),
  };
}
