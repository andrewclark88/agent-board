#!/usr/bin/env node

import { AgentBoardError } from "../domain/errors.js";
import type { RegisterSessionInput, RegisterSessionResult } from "../application/register-session.js";
import { createAgentNameCommand } from "../composition/create-agent-name.js";
import { isMain } from "./is-main.js";

export interface AgentNameCommandDependencies {
  register(input: RegisterSessionInput): Promise<RegisterSessionResult>;
  stdout: Pick<NodeJS.WriteStream, "write">;
  stderr: Pick<NodeJS.WriteStream, "write">;
}

const USAGE = "Usage: agent-name <label>\n";

function errorMessage(error: unknown): string {
  if (error instanceof AgentBoardError) return `${error.code}: ${error.message}`;
  return error instanceof Error ? error.message : "Unexpected failure";
}

export async function runAgentName(
  argv: readonly string[],
  dependencies: AgentNameCommandDependencies,
): Promise<number> {
  if (argv.length !== 1) {
    dependencies.stderr.write(USAGE);
    return 2;
  }

  try {
    const result = await dependencies.register({ projectLabel: argv[0] });
    dependencies.stdout.write(`${result.created ? "Registered" : "Renamed"} ${result.record.identity.projectLabel}\n`);
    return 0;
  } catch (error) {
    dependencies.stderr.write(`${errorMessage(error)}\n`);
    return 1;
  }
}

export async function main(argv: readonly string[] = process.argv.slice(2)): Promise<number> {
  const command = createAgentNameCommand();
  return runAgentName(argv, {
    ...command,
    stdout: process.stdout,
    stderr: process.stderr,
  });
}

if (isMain(import.meta.url, process.argv[1])) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((error: unknown) => {
    process.stderr.write(`${errorMessage(error)}\n`);
    process.exitCode = 1;
  });
}
