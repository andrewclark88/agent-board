export const SUPPORTED_CLAUDE_FAMILY = "2.1.226+ (before 2.2.0)";

export type ClaudeCompatibility =
  | { readonly compatible: true; readonly version: string }
  | { readonly compatible: false; readonly version?: string; readonly reasonCode: "unrecognized" | "unsupported" };

export function parseClaudeVersion(output: string): string | undefined {
  return /(?:^|\s)(\d+\.\d+\.\d+)(?:\s|$)/u.exec(output.trim())?.[1];
}

export function checkClaudeCompatibility(output: string): ClaudeCompatibility {
  const version = parseClaudeVersion(output);
  if (version === undefined) return { compatible: false, reasonCode: "unrecognized" };
  const [major, minor, patch] = version.split(".").map(Number);
  return major === 2 && minor === 1 && (patch ?? 0) >= 226
    ? { compatible: true, version }
    : { compatible: false, version, reasonCode: "unsupported" };
}
