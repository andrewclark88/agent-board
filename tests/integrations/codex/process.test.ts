import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { test } from "node:test";

import type { ProcessRequest, ProcessResult, ProcessRunner } from "../../../src/integrations/process-runner.js";
import { CodexProcessHost } from "../../../src/integrations/codex/process.js";

class FakeChild extends EventEmitter {
  readonly stdout = new EventEmitter();
  readonly stderr = new EventEmitter();
  readonly pid = 4321;
}

class FakeRunner implements ProcessRunner {
  async run(_request: ProcessRequest): Promise<ProcessResult> { return { stdout: "codex-cli 0.147.0\n", stderr: "", exitCode: 0 }; }
}

test("process host uses split stream readiness and exact remote argv", async () => {
  const children: FakeChild[] = [];
  const requests: { command: string; args: readonly string[]; options: unknown }[] = [];
  const spawn = ((command: string, args: readonly string[], options: unknown) => {
    const child = new FakeChild(); children.push(child); requests.push({ command, args, options });
    if (args[0] === "app-server") setImmediate(() => { child.stdout.emit("data", Buffer.from("listening on ws://127.0.")); child.stderr.emit("data", Buffer.from("0.1:45")); });
    return child;
  }) as never;
  const host = new CodexProcessHost({ runner: new FakeRunner(), spawn, readinessTimeoutMs: 500 });
  assert.equal(await host.version(), "0.147.0");
  const started = await host.startAppServer(new AbortController().signal);
  assert.equal(started.endpoint.websocketUrl.port, "45");
  await host.startRemoteTui(started.endpoint, ["--full-auto"]);
  assert.deepEqual(requests[1]?.args, ["--full-auto", "--remote", "ws://127.0.0.1:45/", "-c", "tui.terminal_title=null"]);
  assert.deepEqual(requests[1]?.options, { shell: false, detached: false, stdio: "inherit" });
  for (const child of children) child.emit("close", 0, null);
});

test("process host rejects reserved topology arguments before spawn", async () => {
  let calls = 0;
  const spawn = (() => { calls += 1; return new FakeChild(); }) as never;
  const host = new CodexProcessHost({ spawn });
  await assert.rejects(host.startRemoteTui({ websocketUrl: new URL("ws://127.0.0.1:45") }, ["--remote", "elsewhere"]));
  assert.equal(calls, 0);
});
