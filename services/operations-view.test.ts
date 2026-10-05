import test from "node:test";
import assert from "node:assert/strict";
import { buildOperationsTaskRows } from "./operations-view.js";
import type { RobotTask, TaskEvent } from "./domain.js";

const base: RobotTask = { id: "t1", hotelId: "w-sg", kind: "IRD_DELIVERY", robotId: "r1", originLocationId: "kitchen", destinationLocationId: "room-801", status: "FAILED", createdAt: "2026-10-05T01:00:00Z", updatedAt: "2026-10-05T01:05:00Z", payload: { guestName: "PRIVATE" } };
const events: TaskEvent[] = [
  { taskId: "t1", event: "DISPATCHED", source: "QY_HUB", timestamp: "2026-10-05T01:01:00Z" },
  { taskId: "t1", event: "STAFF_ESCALATION_REQUIRED", source: "QY_HUB", timestamp: "2026-10-05T01:06:00Z" },
];

test("operations view highlights failed task without exposing payload", () => {
  const rows = buildOperationsTaskRows([base], events, "w-sg");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].needsStaffAttention, true);
  assert.equal(rows[0].lastEvent, "STAFF_ESCALATION_REQUIRED");
  assert.equal("payload" in rows[0], false);
});

test("operations view isolates hotels", () => {
  const other = { ...base, id: "t2", hotelId: "other" };
  assert.deepEqual(buildOperationsTaskRows([base, other], events, "w-sg").map(r => r.taskId), ["t1"]);
});
