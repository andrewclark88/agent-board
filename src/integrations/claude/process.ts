import { spawn, type ChildProcess } from "node:child_process";

import { AgentBoardError } from "../../domain/errors.js";

export interface ClaudeProcessExit {
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
}

export interface ClaudeChild {
  readonly pid: number;
  readonly exited: Promise<ClaudeProcessExit>;
  readonly process: ChildProcess;
}

export interface ClaudeProcessHostOptions {
  readonly command?: string;
  readonly spawnProcess?: typeof spawn;
}

const DISALLOWED_INTERACTIVE_ARGS = new Set(["-p", "--print", "--bare", "--background"]);

export class ClaudeProcessHost {
  private readonly command: string;
  private readonly spawnProcess: typeof spawn;

  constructor(options: ClaudeProcessHostOptions = {}) {
    this.command = options.command ?? "claude";
    this.spawnProcess = options.spawnProcess ?? spawn;
  }

  start(pluginRoot: string, forwardedArgs: readonly string[], sessionId: string): ClaudeChild {
    const forbidden = forwardedArgs.find((arg) => DISALLOWED_INTERACTIVE_ARGS.has(arg));
    if (forbidden !== undefined) {
      throw new AgentBoardError("ADAPTER_FAILURE", `${forbidden} is incompatible with managed interactive Claude observation`);
    }
    let child: ChildProcess;
    try {
      child = this.spawnProcess(this.command, ["--plugin-dir", pluginRoot, ...forwardedArgs], {
        shell: false,
        stdio: "inherit",
        env: { ...process.env, AGENT_BOARD_SESSION_ID: sessionId },
      });
    } catch (error) {
      throw new AgentBoardError("ADAPTER_FAILURE", "Unable to start Claude", { cause: error });
    }
    const pid = child.pid;
    if (pid === undefined || !Number.isSafeInteger(pid) || pid <= 1) {
      child.kill("SIGTERM");
      throw new AgentBoardError("ADAPTER_FAILURE", "Claude did not expose a safe process id");
    }
    const exited = new Promise<ClaudeProcessExit>((resolve, reject) => {
      child.once("error", (error) => reject(new AgentBoardError("ADAPTER_FAILURE", "Claude process failed", { cause: error })));
      child.once("close", (exitCode, signal) => resolve({ exitCode, signal }));
    });
    return { pid, process: child, exited };
  }

  async stop(child: ClaudeChild): Promise<void> {
    if (child.process.exitCode !== null || child.process.signalCode !== null) return;
    child.process.kill("SIGTERM");
    await Promise.race([
      child.exited.then(() => undefined),
      new Promise<void>((resolve) => setTimeout(resolve, 5_000)),
    ]);
    if (child.process.exitCode === null && child.process.signalCode === null) child.process.kill("SIGKILL");
  }
}
