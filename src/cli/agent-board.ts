#!/usr/bin/env node

import { createAgentBoardCommand, type AgentBoardCommand } from "../composition/create-agent-board.js";
import { formatCliError } from "./output.js";
import { isMain } from "./is-main.js";

export interface AgentBoardCliDependencies {
  readonly ack: AgentBoardCommand["ack"];
  readonly unregister: AgentBoardCommand["unregister"];
  readonly stdout: Pick<NodeJS.WriteStream, "write">;
  readonly stderr: Pick<NodeJS.WriteStream, "write">;
}

type CommandName = "ack" | "unregister";
interface CommandDefinition {
  execute(target: string | undefined, dependencies: AgentBoardCliDependencies): Promise<string>;
}
const COMMANDS: Readonly<Record<CommandName, CommandDefinition>> = {
  ack: {
    async execute(target, dependencies) {
      const result = await dependencies.ack(target);
      const deferred = result.titleRendered ? "" : " Title sync deferred.";
      return `Acknowledged ${result.record.sessionId}.${deferred}\n`;
    },
  },
  unregister: {
    async execute(target, dependencies) {
      const result = await dependencies.unregister(target);
      return `Unregistered ${result.sessionId}.\n`;
    },
  },
};
const USAGE = "Usage: agent-board <ack|unregister> [session-id]\n";

function parse(argv: readonly string[]): { command: CommandName; target?: string } | null {
  if (argv.length < 1 || argv.length > 2) return null;
  const command = argv[0];
  if (command !== "ack" && command !== "unregister") return null;
  if (argv.length === 1) return { command };
  const target = argv[1];
  if (target === undefined || target.length === 0 || target.startsWith("-")) return null;
  return { command, target };
}

export async function runAgentBoard(
  argv: readonly string[],
  dependencies: AgentBoardCliDependencies,
): Promise<number> {
  const parsed = parse(argv);
  if (parsed === null) {
    dependencies.stderr.write(USAGE);
    return 2;
  }

  try {
    dependencies.stdout.write(await COMMANDS[parsed.command].execute(parsed.target, dependencies));
    return 0;
  } catch (error) {
    dependencies.stderr.write(`${formatCliError(error)}\n`);
    return 1;
  }
}

export async function main(argv: readonly string[] = process.argv.slice(2)): Promise<number> {
  return runAgentBoard(argv, {
    ...createAgentBoardCommand(),
    stdout: process.stdout,
    stderr: process.stderr,
  });
}

if (isMain(import.meta.url, process.argv[1])) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((error: unknown) => {
    process.stderr.write(`${formatCliError(error)}\n`);
    process.exitCode = 1;
  });
}
