import test from "node:test";
import assert from "node:assert/strict";
import { canTransition, transitionTask } from "./task-state.js";
import type { RobotTask } from "./domain.js";

const task: RobotTask = {
  id: "t1", hotelId: "w-sg", kind: "IRD_DELIVERY", originLocationId: "pantry",
  destinationLocationId: "room-1208", status: "CREATED",
  createdAt: "2026-10-05T08:00:00Z", updatedAt: "2026-10-05T08:00:00Z"
};

test("allows normal IRD lifecycle transitions", () => {
  const ready = transitionTask(task, "READY", "2026-10-05T08:01:00Z");
  const dispatched = transitionTask(ready, "DISPATCHED", "2026-10-05T08:02:00Z");
  assert.equal(dispatched.status, "DISPATCHED");
  assert.equal(dispatched.updatedAt, "2026-10-05T08:02:00Z");
  assert.equal(canTransition("IN_TRANSIT", "WAITING_FOR_LIFT"), true);
});

test("blocks impossible or terminal transitions", () => {
  assert.throws(() => transitionTask(task, "COMPLETED"), /Invalid task transition/);
  assert.equal(canTransition("COMPLETED", "READY"), false);
  assert.equal(canTransition("FAILED", "DISPATCHED"), false);
});
