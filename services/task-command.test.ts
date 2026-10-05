import test from "node:test";
import assert from "node:assert/strict";
import { assertCommandCanExecute, commandAcceptedEvent } from "./task-command.js";
import type { RobotTask } from "./domain.js";

const task: RobotTask = { id: "t1", hotelId: "w-singapore", kind: "IRD_DELIVERY", originLocationId: "pantry", destinationLocationId: "room-501", status: "READY", createdAt: "2026-10-05T15:00:00Z", updatedAt: "2026-10-05T15:00:00Z" };
const command = { commandId: "cmd-1", taskId: "t1", action: "DISPATCH_ROBOT" as const, createdAt: "2026-10-05T15:01:00Z" };

test("new command may cross integration boundary once", () => {
  assert.doesNotThrow(() => assertCommandCanExecute(task, command, []));
});

test("accepted command cannot execute twice", () => {
  const accepted = commandAcceptedEvent(command);
  assert.throws(() => assertCommandCanExecute(task, command, [accepted]), /Duplicate command/);
});

test("terminal task cannot issue physical commands", () => {
  assert.throws(() => assertCommandCanExecute({ ...task, status: "COMPLETED" }, command, []), /terminal task/);
});
