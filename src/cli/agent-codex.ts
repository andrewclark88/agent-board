import { AgentBoardError } from "../domain/errors.js";
import { createAgentCodexCommand, type AgentCodexCommand } from "../composition/create-agent-codex.js";

export interface AgentCodexCommandDependencies {
  launch(args: readonly string[], signal: AbortSignal): Promise<{ outcome: "clean" | "failed" | "terminated"; exitCode: number }>;
  stdout: Pick<NodeJS.WriteStream, "write">;
  stderr: Pick<NodeJS.WriteStream, "write">;
}

function errorMessage(error: unknown): string {
  if (error instanceof AgentBoardError) return `${error.code}: ${error.message}`;
  return error instanceof Error ? error.message : "Unexpected failure";
}

export async function runAgentCodex(
  argv: readonly string[],
  dependencies: AgentCodexCommandDependencies,
  signal: AbortSignal,
): Promise<number> {
  try {
    const result = await dependencies.launch(argv, signal);
    return result.exitCode;
  } catch (error) {
    dependencies.stderr.write(`${errorMessage(error)}\n`);
    return 1;
  }
}

export async function main(argv: readonly string[] = process.argv.slice(2)): Promise<number> {
  const command = createAgentCodexCommand();
  const controller = new AbortController();
  const onInterrupt = () => undefined;
  const onTerminate = (signal: NodeJS.Signals) => controller.abort(new Error(signal));
  process.on("SIGINT", onInterrupt);
  process.on("SIGHUP", onTerminate);
  process.on("SIGTERM", onTerminate);
  try {
    return await runAgentCodex(argv, {
      ...command,
      stdout: process.stdout,
      stderr: process.stderr,
    }, controller.signal);
  } finally {
    process.off("SIGINT", onInterrupt);
    process.off("SIGHUP", onTerminate);
    process.off("SIGTERM", onTerminate);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((code) => { process.exitCode = code; }).catch((error: unknown) => {
    process.stderr.write(`${errorMessage(error)}\n`);
    process.exitCode = 1;
  });
}
