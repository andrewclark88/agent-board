export const ACTIVITIES = ["unknown", "idle", "working"] as const;
export const ATTENTIONS = ["none", "completion_unread", "input_required"] as const;
export const HEALTH_STATES = ["live", "stale", "error"] as const;
export const TERMINAL_PRESENCES = ["visible", "hidden", "missing", "unknown"] as const;
export const CONFIDENCE_LEVELS = ["authoritative", "corroborated", "inferred"] as const;

export type Activity = (typeof ACTIVITIES)[number];
export type Attention = (typeof ATTENTIONS)[number];
export type HealthState = (typeof HEALTH_STATES)[number];
export type TerminalPresence = (typeof TERMINAL_PRESENCES)[number];
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];
