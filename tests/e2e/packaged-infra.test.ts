import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";

import { createPackageHarness } from "./support/package-harness.js";

test("packed install exposes source-free public bins over isolated executable boundaries", async () => {
  const harness = await createPackageHarness();
  try {
    const installed = await readdir(`${harness.prefix}/node_modules/agent-board`);
    assert.deepEqual(installed.sort(), ["README.md", "dist", "package.json"]);

    const named = await harness.run("agent-name", ["data-platform"]);
    assert.equal(named.code, 0, named.stderr);
    assert.match(named.stdout, /Registered data-platform/u);

    const board = await harness.run("agents");
    assert.equal(board.code, 0, board.stderr);
    assert.match(board.stdout, /data-platform/u);

    const doctor = await harness.run("agent-board", ["doctor"]);
    assert.equal(doctor.code, 0, doctor.stderr);
    assert.match(doctor.stdout, /Codex/u);
    assert.match(doctor.stdout, /Ghostty/u);
  } finally {
    await harness.close();
  }
});
