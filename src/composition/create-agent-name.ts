import { randomUUID } from "node:crypto";

import { registerSession, type RegisterSessionDependencies } from "../application/register-session.js";
import type { RegisterSessionInput, RegisterSessionResult } from "../application/register-session.js";
import type { RegistrationStore, RegistrationTerminalPort, RepositoryContextPort } from "../domain/ports.js";
import { JsonSessionStore } from "../infrastructure/json-session-store.js";
import { GitRepositoryContext } from "../integrations/git/repository-context.js";
import { GhosttyClient } from "../integrations/ghostty/client.js";

export interface AgentNameCommand {
  register(input: RegisterSessionInput): Promise<RegisterSessionResult>;
}

export interface AgentNameCompositionOptions {
  store?: RegistrationStore;
  terminal?: RegistrationTerminalPort;
  repositories?: RepositoryContextPort;
  workingFreshForMs?: number;
}

export function createAgentNameCommand(options: AgentNameCompositionOptions = {}): AgentNameCommand {
  const dependencies: RegisterSessionDependencies = {
    store: options.store ?? new JsonSessionStore(),
    terminal: options.terminal ?? new GhosttyClient(),
    repositories: options.repositories ?? new GitRepositoryContext(),
    clock: { now: () => new Date() },
    ids: { sessionId: () => randomUUID() },
    workingFreshForMs: options.workingFreshForMs ?? 60_000,
  };
  return {
    register: (input) => registerSession(dependencies, input),
  };
}
