import { AgentBoardError } from "../../domain/errors.js";

const VERSION = /\b(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?\b/gu;
export const SUPPORTED_CODEX_FAMILY = "0.147.x";

export function parseCodexVersion(output: string): string {
  const versions = [...output.matchAll(VERSION)].map((match) => `${match[1]}.${match[2]}.${match[3]}`);
  const unique = [...new Set(versions)];
  if (unique.length === 0) {
    throw new AgentBoardError("ADAPTER_FAILURE", "Codex version output did not contain a semantic version");
  }
  if (unique.length > 1) {
    throw new AgentBoardError("ADAPTER_FAILURE", "Codex version output contained conflicting versions", {
      cause: unique,
    });
  }
  return unique[0];
}

export interface CodexCompatibility {
  compatible: boolean;
  version?: string;
  reasonCode?: "unrecognized" | "unsupported";
  reason?: string;
}

export function checkCodexCompatibility(output: string): CodexCompatibility {
  let version: string;
  try {
    version = parseCodexVersion(output);
  } catch (error) {
    return {
      compatible: false,
      reasonCode: "unrecognized",
      reason: error instanceof Error ? error.message : "Unable to parse Codex version",
    };
  }

  const [major, minor] = version.split(".").map(Number);
  if (major !== 0 || minor !== 147) {
    return {
      compatible: false,
      version,
      reasonCode: "unsupported",
      reason: `Codex ${version} is unsupported; managed observation requires ${SUPPORTED_CODEX_FAMILY}`,
    };
  }
  return { compatible: true, version };
}
