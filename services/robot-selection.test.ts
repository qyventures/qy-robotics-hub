import test from "node:test";
import assert from "node:assert/strict";
import { selectRobot } from "./robot-selection.js";
import type { RobotRecord, RobotTask } from "./domain.js";

const robots: RobotRecord[] = [
  { id: "delivery-1", vendor: "KEENON", vendorRobotId: "k1", name: "Butler 1", capabilities: ["DELIVERY"], active: true },
  { id: "concierge-1", vendor: "KEENON", vendorRobotId: "k2", name: "Concierge 1", capabilities: ["CONCIERGE", "GUIDANCE"], active: true },
];
const task = (id: string, kind: RobotTask["kind"], robotId?: string): RobotTask => ({ id, hotelId: "w-sg", kind, robotId, originLocationId: "lobby", destinationLocationId: "room", status: "READY", createdAt: "2026-10-05T00:00:00Z", updatedAt: "2026-10-05T00:00:00Z" });

test("IRD selects a free delivery robot", () => {
  assert.equal(selectRobot(task("t1", "IRD_DELIVERY"), robots, []).id, "delivery-1");
});

test("concierge selects concierge-capable robot", () => {
  assert.equal(selectRobot(task("t2", "CONCIERGE_GUIDE"), robots, []).id, "concierge-1");
});

test("does not double-assign an active robot", () => {
  assert.throws(() => selectRobot(task("t2", "IRD_DELIVERY"), robots, [task("busy", "IRD_DELIVERY", "delivery-1")]), /No available robot/);
});
