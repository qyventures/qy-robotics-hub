import test from "node:test";
import assert from "node:assert/strict";
import { decideRecovery } from "./recovery.js";
import type { RobotTask } from "./domain.js";

const task = (status: RobotTask["status"]): RobotTask => ({
  id: "task-1", hotelId: "w-sg", kind: "IRD_DELIVERY", originLocationId: "pantry", destinationLocationId: "room-101",
  status, createdAt: "2026-10-05T12:00:00Z", updatedAt: "2026-10-05T12:00:00Z",
});

test("failed physical tasks escalate to staff rather than auto-retry", () => {
  assert.equal(decideRecovery(task("FAILED"), []).action, "ESCALATE_STAFF");
});

test("lift waits are surfaced as lift checks", () => {
  assert.equal(decideRecovery(task("WAITING_FOR_LIFT"), []).action, "CHECK_LIFT");
});

test("ready undispatched tasks can be safely retried", () => {
  assert.equal(decideRecovery(task("READY"), []).action, "RETRY_DISPATCH");
});
