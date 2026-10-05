import assert from "node:assert/strict";
import test from "node:test";
import { nextOperatorAction } from "./operator-actions.js";
import type { RobotTask, TaskEvent } from "./domain.js";

function task(status: RobotTask["status"]): RobotTask {
  return { id: "t1", hotelId: "w-singapore", kind: "IRD_DELIVERY", originLocationId: "kitchen", destinationLocationId: "room-501", status, createdAt: "2026-10-06T00:00:00Z", updatedAt: "2026-10-06T00:00:00Z" };
}

test("maps lift wait and arrival to explicit staff actions", () => {
  assert.equal(nextOperatorAction(task("WAITING_FOR_LIFT"), []).action, "CHECK_LIFT");
  assert.equal(nextOperatorAction(task("ARRIVED"), []).action, "HANDOFF");
});

test("failed physical command surfaces robot check without retrying", () => {
  const events: TaskEvent[] = [{ taskId: "t1", event: "COMMAND_FAILED", source: "QY_HUB", timestamp: "2026-10-06T00:01:00Z" }];
  assert.equal(nextOperatorAction(task("IN_TRANSIT"), events).action, "CHECK_ROBOT");
});
