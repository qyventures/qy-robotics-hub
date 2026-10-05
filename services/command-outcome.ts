import type { TaskEvent } from "./domain.js";
import type { TaskCommand } from "./task-command.js";

/** Record adapter outcomes without storing vendor credentials or raw sensitive payloads. */
export function commandSucceededEvent(command: TaskCommand, source: TaskEvent["source"], externalReference?: string): TaskEvent {
  return {
    taskId: command.taskId,
    event: "COMMAND_SUCCEEDED",
    source,
    timestamp: new Date().toISOString(),
    data: clean({ commandId: command.commandId, action: command.action, externalReference }),
  };
}

export function commandFailedEvent(command: TaskCommand, source: TaskEvent["source"], errorCode: string, retryable = false): TaskEvent {
  if (!errorCode) throw new Error("Sanitized error code is required");
  return {
    taskId: command.taskId,
    event: "COMMAND_FAILED",
    source,
    timestamp: new Date().toISOString(),
    data: { commandId: command.commandId, action: command.action, errorCode, retryable },
  };
}

/** True only when a command was accepted but has no terminal adapter outcome yet. */
export function isCommandPending(commandId: string, events: TaskEvent[]): boolean {
  const accepted = events.some(event => event.event === "COMMAND_ACCEPTED" && event.data?.commandId === commandId);
  const terminal = events.some(event => (event.event === "COMMAND_SUCCEEDED" || event.event === "COMMAND_FAILED") && event.data?.commandId === commandId);
  return accepted && !terminal;
}

function clean(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}
