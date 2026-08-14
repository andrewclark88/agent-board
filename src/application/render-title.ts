import { AgentBoardError } from "../domain/errors.js";
import type { Clock, SessionStore, RegistrationTerminalPort } from "../domain/ports.js";
import { projectSession } from "../domain/projection.js";
import type { SessionRecord } from "../domain/session.js";

export interface RenderTitleDependencies {
  readonly store: SessionStore;
  readonly terminal: Pick<RegistrationTerminalPort, "setTitle">;
  readonly clock: Clock;
  readonly workingFreshForMs: number;
}

/** Render a title from the latest durable record, after registration locking. */
export async function renderSessionTitle(
  dependencies: RenderTitleDependencies,
  sessionId: string,
): Promise<SessionRecord> {
  const record = await dependencies.store.get(sessionId);
  if (record === null) {
    throw new AgentBoardError("NOT_FOUND", `Session not found: ${sessionId}`);
  }

  const projection = projectSession(record, {
    now: dependencies.clock.now(),
    workingFreshForMs: dependencies.workingFreshForMs,
  });
  const identity = {
    adapter: record.terminal.adapter,
    windowId: record.terminal.windowId,
    tabId: record.terminal.tabId,
    terminalId: record.terminal.terminalId,
  } as const;
  await dependencies.terminal.setTitle(identity, projection.title);
  return record;
}
