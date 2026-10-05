import test from "node:test";
import assert from "node:assert/strict";
import { createConciergeGuideTask, createIrdDeliveryTask } from "./workflows.js";

test("creates an IRD delivery task with hotel and waypoint references", () => {
  const task = createIrdDeliveryTask({
    id: "task-1",
    hotelId: "w-singapore",
    originLocationId: "service-pantry-l1",
    destinationLocationId: "room-1508",
    items: ["2 towels"],
  });

  assert.equal(task.kind, "IRD_DELIVERY");
  assert.equal(task.status, "CREATED");
  assert.equal(task.hotelId, "w-singapore");
  assert.deepEqual(task.payload, { items: ["2 towels"] });
});

test("creates a concierge guide task", () => {
  const task = createConciergeGuideTask({
    id: "task-2",
    hotelId: "w-singapore",
    originLocationId: "lobby",
    destinationLocationId: "breakfast-restaurant",
    requestText: "Where is breakfast?",
  });

  assert.equal(task.kind, "CONCIERGE_GUIDE");
  assert.equal(task.status, "CREATED");
  assert.deepEqual(task.payload, { requestText: "Where is breakfast?" });
});
