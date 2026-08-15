import { acknowledgeSession, type AcknowledgeSessionDependencies, type AcknowledgeSessionResult } from "../application/acknowledge-session.js";
import { unregisterAgentSession, type UnregisterAgentSessionDependencies } from "../application/unregister-agent-session.js";
import type { ReconciliationTerminalPort, SessionStore } from "../domain/ports.js";
import type { SessionRecord } from "../domain/session.js";
import { JsonSessionStore } from "../infrastructure/json-session-store.js";
import { GhosttyClient } from "../integrations/ghostty/client.js";

export interface AgentBoardCommand {
  readonly ack: (explicitSessionId?: string) => Promise<AcknowledgeSessionResult>;
  readonly unregister: (explicitSessionId?: string) => Promise<SessionRecord>;
}

export interface AgentBoardCompositionOptions {
  readonly store?: SessionStore;
  readonly terminal?: ReconciliationTerminalPort & { current(): Promise<import("../domain/ports.js").FocusedTerminalContext> };
  readonly workingFreshForMs?: number;
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
  return {
    ack: (explicitSessionId) => acknowledgeSession(acknowledgeDependencies, explicitSessionId),
    unregister: (explicitSessionId) => unregisterAgentSession(unregisterDependencies, explicitSessionId),
  };
}
