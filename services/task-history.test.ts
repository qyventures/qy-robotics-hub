import test from "node:test";
import assert from "node:assert/strict";
import { dashboardSummary, taskHistory } from "./task-history.js";
import { createIrdDeliveryTask } from "./workflows.js";

test("task history filters and orders events", () => {
  const task = createIrdDeliveryTask({ id: "t1", hotelId: "w-sg", originLocationId: "pantry", destinationLocationId: "1508", items: ["towel"] });
  const view = taskHistory(task, [
    { taskId: "other", event: "X", source: "QY_HUB", timestamp: "2026-10-05T01:00:00Z" },
    { taskId: "t1", event: "DISPATCHED", source: "ROBOT", timestamp: "2026-10-05T01:02:00Z" },
    { taskId: "t1", event: "CREATED", source: "QY_HUB", timestamp: "2026-10-05T01:01:00Z" },
  ]);
  assert.deepEqual(view.events.map(e => e.event), ["CREATED", "DISPATCHED"]);
});

test("dashboard summarises active and terminal tasks", () => {
  const base = createIrdDeliveryTask({ id: "t1", hotelId: "w-sg", originLocationId: "pantry", destinationLocationId: "1508", items: ["towel"] });
  const result = dashboardSummary([base, { ...base, id: "t2", status: "COMPLETED" }, { ...base, id: "t3", status: "FAILED" }]);
  assert.deepEqual({ total: result.total, active: result.active, completed: result.completed, failed: result.failed }, { total: 3, active: 1, completed: 1, failed: 1 });
});
