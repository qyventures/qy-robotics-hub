import test from "node:test";
import assert from "node:assert/strict";
import { dashboardSummary } from "./dashboard.js";
import type { RobotTask } from "./domain.js";

function task(id: string, status: RobotTask["status"], kind: RobotTask["kind"] = "IRD_DELIVERY"): RobotTask {
  return { id, hotelId: "w-sg", kind, originLocationId: "lobby", destinationLocationId: "room", status, createdAt: "2026-10-05T00:00:00Z", updatedAt: "2026-10-05T00:00:00Z" };
}

test("dashboard summarises live hotel operations", () => {
  const summary = dashboardSummary([
    task("1", "IN_TRANSIT"),
    task("2", "WAITING_FOR_LIFT"),
    task("3", "COMPLETED", "CONCIERGE_GUIDE"),
    task("4", "FAILED"),
  ]);
  assert.deepEqual(summary, { total: 4, active: 2, completed: 1, failed: 1, waitingForLift: 1, byKind: { IRD_DELIVERY: 3, CONCIERGE_GUIDE: 1 } });
});
