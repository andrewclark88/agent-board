import type {
  SessionRecord,
  TerminalIdentity,
  TerminalObservation,
} from "./session.js";

export interface Clock {
  now(): Date;
}

export interface IdGenerator {
  sessionId(): string;
}

export type SessionMutation = (
  current: Readonly<SessionRecord>,
) => SessionRecord;

export interface SessionStore {
  get(sessionId: string): Promise<SessionRecord | null>;
  list(): Promise<readonly SessionRecord[]>;
  create(record: SessionRecord): Promise<SessionRecord>;
  mutate(sessionId: string, mutation: SessionMutation): Promise<SessionRecord>;
  remove(sessionId: string): Promise<void>;
}

export interface TerminalPort {
  current(): Promise<TerminalObservation>;
  inspect(identity: TerminalIdentity): Promise<TerminalObservation>;
  setTitle(identity: TerminalIdentity, title: string): Promise<void>;
  clearTitle(identity: TerminalIdentity): Promise<void>;
}

export interface AgentObservationSource {
  observations(signal: AbortSignal): AsyncIterable<unknown>;
}
