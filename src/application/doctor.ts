import type { Clock } from "../domain/ports.js";
import type {
  GhosttyDiagnosticReport,
  IntegrationDiagnostic,
} from "../integrations/ghostty/diagnostics.js";

export type DoctorComponent = "runtime" | "state" | "codex" | "ghostty";
export type DoctorSeverity = "info" | "warning" | "error";

export interface DoctorCheck {
  readonly component: DoctorComponent;
  readonly code: string;
  readonly severity: DoctorSeverity;
  readonly message: string;
  readonly remediation?: string;
}

export interface DoctorReport {
  readonly schemaVersion: 1;
  readonly checkedAt: string;
  readonly ready: boolean;
  readonly checks: readonly DoctorCheck[];
}

export interface StateProbePort {
  probe(): Promise<string>;
}

export interface CodexVersionPort {
  version(): Promise<string>;
}

export interface DoctorDependencies {
  readonly clock: Clock;
  readonly nodeVersion: string;
  readonly state: StateProbePort;
  readonly codex: CodexVersionPort;
  readonly ghostty: () => Promise<GhosttyDiagnosticReport>;
}

const COMPONENT_ORDER: readonly DoctorComponent[] = ["runtime", "state", "codex", "ghostty"];
const SEVERITIES = new Set<DoctorSeverity>(["info", "warning", "error"]);
const COMPONENTS = new Set<DoctorComponent>(COMPONENT_ORDER);
const SAFE_TEXT_LIMIT = 512;

function assertText(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > SAFE_TEXT_LIMIT || /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/u.test(value)) {
    throw new TypeError(`${field} must be non-empty terminal-safe text`);
  }
}

function assertCheckShape(value: unknown, field: string): asserts value is IntegrationDiagnostic {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError(`${field} must be an object`);
  }
  const check = value as Record<string, unknown>;
  assertText(check.code, `${field}.code`);
  assertText(check.message, `${field}.message`);
  if (!SEVERITIES.has(check.severity as DoctorSeverity)) {
    throw new TypeError(`${field}.severity must be a known severity`);
  }
  if (check.remediation !== undefined) assertText(check.remediation, `${field}.remediation`);
}

function check(
  component: DoctorComponent,
  code: string,
  severity: DoctorSeverity,
  message: string,
  remediation?: string,
): DoctorCheck {
  assertText(code, "diagnostic code");
  assertText(message, "diagnostic message");
  if (remediation !== undefined) assertText(remediation, "diagnostic remediation");
  const value: DoctorCheck = remediation === undefined
    ? { component, code, severity, message }
    : { component, code, severity, message, remediation };
  return Object.freeze(value);
}

function runtimeChecks(nodeVersion: string): DoctorCheck[] {
  assertText(nodeVersion, "nodeVersion");
  const match = /^(\d+)\.(\d+)\.(\d+)/u.exec(nodeVersion);
  if (!match) {
    return [check("runtime", "RUNTIME_VERSION_UNKNOWN", "error", "Node.js version could not be recognized", "Install Node.js 22 or later and ensure the supported runtime is used.")];
  }
  const major = Number(match[1]);
  if (major < 22) {
    return [check("runtime", "RUNTIME_VERSION_UNSUPPORTED", "error", `Node.js ${nodeVersion} is unsupported; version 22 or later is required`, "Upgrade Node.js to version 22 or later.")];
  }
  return [check("runtime", "RUNTIME_SUPPORTED", "info", `Node.js ${nodeVersion} is supported`)];
}

function failureCheck(component: DoctorComponent, code: string, message: string, remediation: string): DoctorCheck {
  return check(component, code, "error", message, remediation);
}

async function stateChecks(dependencies: DoctorDependencies): Promise<DoctorCheck[]> {
  let root: unknown;
  try {
    root = await dependencies.state.probe();
  } catch {
    return [failureCheck("state", "STATE_DIRECTORY_UNAVAILABLE", "Agent Board state directory is not writable", "Check the Agent Board state directory permissions and make sure it is available locally.")];
  }
  assertText(root, "state probe root");
  return [check("state", "STATE_DIRECTORY_WRITABLE", "info", "Agent Board state directory is readable and writable")];
}

async function codexChecks(dependencies: DoctorDependencies): Promise<DoctorCheck[]> {
  let version: unknown;
  try {
    version = await dependencies.codex.version();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/unsupported/iu.test(message)) {
      return [failureCheck("codex", "CODEX_VERSION_UNSUPPORTED", "Installed Codex is incompatible with managed observation", "Install the tested Codex 0.147.x release.")];
    }
    if (/semantic version|parse/iu.test(message)) {
      return [failureCheck("codex", "CODEX_VERSION_UNKNOWN", "Codex did not report a recognizable version", "Run codex --version and install the tested Codex 0.147.x release.")];
    }
    return [failureCheck("codex", "CODEX_UNAVAILABLE", "Codex could not be started for a compatibility check", "Install Codex 0.147.x and ensure the codex executable is on PATH.")];
  }
  assertText(version, "Codex version");
  return [check("codex", "CODEX_COMPATIBLE", "info", `Codex ${version} is compatible with managed observation`)];
}

function mapGhosttyDiagnostic(item: IntegrationDiagnostic): DoctorCheck {
  assertCheckShape(item, "Ghostty diagnostic");
  return check("ghostty", item.code, item.severity, item.message, item.remediation);
}

async function ghosttyChecks(dependencies: DoctorDependencies): Promise<DoctorCheck[]> {
  let value: unknown;
  try {
    value = await dependencies.ghostty();
  } catch {
    return [failureCheck("ghostty", "GHOSTTY_DIAGNOSTICS_UNAVAILABLE", "Ghostty diagnostics could not be completed", "Ensure Ghostty is installed and retry agent-board doctor.")];
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError("Ghostty diagnostic report must be an object");
  }
  const report = value as Partial<GhosttyDiagnosticReport>;
  if (typeof report.automationReady !== "boolean" || !Array.isArray(report.diagnostics)) {
    throw new TypeError("Ghostty diagnostic report has an invalid shape");
  }
  if (report.version !== undefined) assertText(report.version, "Ghostty version");
  const mapped = report.diagnostics.map((item, index) => {
    assertCheckShape(item, `Ghostty diagnostic ${index}`);
    return mapGhosttyDiagnostic(item);
  });
  const hasVersionError = mapped.some((item) => item.code === "GHOSTTY_VERSION_UNSUPPORTED" || item.code === "GHOSTTY_VERSION_UNKNOWN" || item.code === "GHOSTTY_NOT_INSTALLED");
  if (report.version !== undefined && !hasVersionError) {
    mapped.push(check("ghostty", "GHOSTTY_VERSION_SUPPORTED", "info", `Ghostty ${report.version} is supported`));
  }
  if (report.automationReady) {
    mapped.push(check("ghostty", "GHOSTTY_AUTOMATION_READY", "info", "Ghostty Automation is available"));
  } else if (!mapped.some((item) => item.code.startsWith("GHOSTTY_AUTOMATION_"))) {
    mapped.push(failureCheck("ghostty", "GHOSTTY_AUTOMATION_UNAVAILABLE", "Ghostty Automation is unavailable", "Open Ghostty, enable AppleScript, and grant Agent Board Automation permission."));
  }
  if (mapped.length === 0) {
    throw new TypeError("Ghostty diagnostics returned no evidence");
  }
  return mapped;
}

function validateClock(clock: Clock): string {
  const value = clock.now();
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new TypeError("Doctor clock must return a valid Date");
  }
  return value.toISOString();
}

export async function diagnoseSystem(dependencies: DoctorDependencies): Promise<DoctorReport> {
  const checkedAt = validateClock(dependencies.clock);
  const checks = [
    ...runtimeChecks(dependencies.nodeVersion),
    ...(await stateChecks(dependencies)),
    ...(await codexChecks(dependencies)),
    ...(await ghosttyChecks(dependencies)),
  ];
  checks.sort((left, right) => {
    const componentDelta = COMPONENT_ORDER.indexOf(left.component) - COMPONENT_ORDER.indexOf(right.component);
    return componentDelta || left.code.localeCompare(right.code);
  });
  const frozenChecks = Object.freeze(checks.slice());
  const report: DoctorReport = {
    schemaVersion: 1,
    checkedAt,
    ready: !frozenChecks.some((item) => item.severity === "error"),
    checks: frozenChecks,
  };
  return Object.freeze(report);
}

export { COMPONENT_ORDER, COMPONENTS };
