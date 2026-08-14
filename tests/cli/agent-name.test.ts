import assert from "node:assert/strict";
import test from "node:test";

import { AgentBoardError } from "../../src/domain/errors.js";
import { runAgentName } from "../../src/cli/agent-name.js";

function streams() {
  let stdout = "";
  let stderr = "";
  return {
    get stdout() { return stdout; },
    get stderr() { return stderr; },
    output: { stdout: { write(value: string) { stdout += value; return true; } }, stderr: { write(value: string) { stderr += value; return true; } } },
  };
}

test("agent-name requires exactly one label without invoking registration", async () => {
  const output = streams();
  let calls = 0;
  const register = async () => { calls += 1; throw new Error("should not run"); };

  assert.equal(await runAgentName([], { register, ...output.output }), 2);
  assert.equal(await runAgentName(["one", "two"], { register, ...output.output }), 2);
  assert.equal(calls, 0);
  assert.equal(output.stdout, "");
  assert.equal(output.stderr, "Usage: agent-name <label>\nUsage: agent-name <label>\n");
});

test("agent-name writes terse success and stable typed failure output", async () => {
  const success = streams();
  const result = await runAgentName(["data platform"], {
    register: async (input) => ({
      created: true,
      record: { identity: { projectLabel: input.projectLabel ?? "" } } as never,
    }),
    ...success.output,
  });
  assert.equal(result, 0);
  assert.equal(success.stdout, "Registered data platform\n");
  assert.equal(success.stderr, "");

  const failure = streams();
  assert.equal(await runAgentName(["bad"], {
    register: async () => { throw new AgentBoardError("CONFLICT", "already registered"); },
    ...failure.output,
  }), 1);
  assert.equal(failure.stdout, "");
  assert.equal(failure.stderr, "CONFLICT: already registered\n");
});
