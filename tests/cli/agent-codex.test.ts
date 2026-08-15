import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { test } from "node:test";

import { AgentBoardError } from "../../src/domain/errors.js";
import { runAgentCodex, runAgentCodexWithSignals } from "../../src/cli/agent-codex.js";

test("agent-codex forwards argv and returns managed outcome code", async () => {
  const calls: readonly string[][] = [];
  const output = { stdout: { write() { return true; } }, stderr: { write() { return true; } } };
  const controller = new AbortController();
  const result = await runAgentCodex(["--full-auto", "-c", "model=x"], {
    launch: async (args) => { (calls as string[][]).push([...args]); return { outcome: "clean", exitCode: 0 }; },
    ...output,
  }, controller.signal);
  assert.equal(result, 0);
  assert.deepEqual(calls, [["--full-auto", "-c", "model=x"]]);
});

test("agent-codex reports typed launch failures without a stack", async () => {
  let stderr = "";
  const result = await runAgentCodex([], {
    launch: async () => { throw new AgentBoardError("ADAPTER_FAILURE", "unsupported Codex"); },
    stdout: { write() { return true; } }, stderr: { write(value: string) { stderr += value; return true; } },
  }, new AbortController().signal);
  assert.equal(result, 1);
  assert.equal(stderr, "ADAPTER_FAILURE: unsupported Codex\n");
});

test("agent-codex signal bridge preserves SIGINT, aborts on termination, and removes listeners", async () => {
  const signals = new EventEmitter();
  const output = { stdout: { write() { return true; } }, stderr: { write() { return true; } } };
  let launchSignal: AbortSignal | undefined;
  const running = runAgentCodexWithSignals([], {
    launch: async (_args, signal) => {
      launchSignal = signal;
      await new Promise<void>((resolve) => signal.addEventListener("abort", () => resolve(), { once: true }));
      return { outcome: "terminated", exitCode: 143 };
    },
    ...output,
  }, signals);
  signals.emit("SIGINT", "SIGINT");
  assert.equal(launchSignal?.aborted, false);
  signals.emit("SIGTERM", "SIGTERM");

  assert.equal(await running, 143);
  assert.equal(launchSignal?.aborted, true);
  assert.equal(signals.listenerCount("SIGINT"), 0);
  assert.equal(signals.listenerCount("SIGHUP"), 0);
  assert.equal(signals.listenerCount("SIGTERM"), 0);
});
