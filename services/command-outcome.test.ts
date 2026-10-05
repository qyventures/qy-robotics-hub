import test from "node:test";
import assert from "node:assert/strict";
import { commandAcceptedEvent, type TaskCommand } from "./task-command.js";
import { commandFailedEvent, commandSucceededEvent, isCommandPending } from "./command-outcome.js";

const command: TaskCommand = { commandId: "cmd-1", taskId: "task-1", action: "REQUEST_LIFT", createdAt: "2026-10-06T00:00:00Z" };

test("accepted command is pending until adapter outcome", () => {
  const accepted = commandAcceptedEvent(command);
  assert.equal(isCommandPending("cmd-1", [accepted]), true);
  assert.equal(isCommandPending("cmd-1", [accepted, commandSucceededEvent(command, "LIFT", "otis-123")]), false);
});

test("failure records sanitized code and retryability", () => {
  const event = commandFailedEvent(command, "LIFT", "LIFT_TIMEOUT", true);
  assert.equal(event.event, "COMMAND_FAILED");
  assert.equal(event.data?.errorCode, "LIFT_TIMEOUT");
  assert.equal(event.data?.retryable, true);
});

test("success records external reference without credentials", () => {
  const event = commandSucceededEvent(command, "LIFT", "otis-123");
  assert.equal(event.data?.externalReference, "otis-123");
  assert.equal(event.data?.commandId, "cmd-1");
});
