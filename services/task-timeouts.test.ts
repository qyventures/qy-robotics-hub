import test from "node:test";
import assert from "node:assert/strict";
import { detectStalledTasks } from "./task-timeouts.js";
import type { RobotTask, TaskEvent } from "./domain.js";

const task = (status: RobotTask["status"], updatedAt = "2026-10-05T15:00:00Z"): RobotTask => ({ id: "t1", hotelId: "w-singapore", kind: "IRD_DELIVERY", originLocationId: "pantry", destinationLocationId: "room-501", status, createdAt: updatedAt, updatedAt });

test("flags lift wait without issuing an automatic retry", () => {
  const alerts = detectStalledTasks([task("WAITING_FOR_LIFT")], [], "2026-10-05T15:04:00Z");
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0]?.action, "CHECK_LIFT");
});

test("recent event resets watchdog age", () => {
  const events: TaskEvent[] = [{ taskId: "t1", event: "LIFT_REQUESTED", source: "QY_HUB", timestamp: "2026-10-05T15:03:30Z" }];
  assert.deepEqual(detectStalledTasks([task("WAITING_FOR_LIFT")], events, "2026-10-05T15:04:00Z"), []);
});

test("terminal tasks never produce watchdog alerts", () => {
  assert.deepEqual(detectStalledTasks([task("COMPLETED")], [], "2026-10-05T16:00:00Z"), []);
});
