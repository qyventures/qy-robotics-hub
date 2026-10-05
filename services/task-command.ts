import type { RobotTask, TaskEvent } from "./domain.js";

export interface TaskCommand {
  commandId: string;
  taskId: string;
  action: "DISPATCH_ROBOT" | "REQUEST_LIFT" | "CALL_ROOM" | "NOTIFY_GUEST";
  createdAt: string;
}

/**
 * Guards the integration boundary against duplicate physical commands.
 * Adapters persist COMMAND_ACCEPTED before performing an external side effect.
 */
export function assertCommandCanExecute(task: RobotTask, command: TaskCommand, events: TaskEvent[]): void {
  if (command.taskId !== task.id) throw new Error("Command task mismatch");
  if (task.status === "COMPLETED" || task.status === "FAILED") throw new Error("Cannot command terminal task");
  const duplicate = events.some(event => event.event === "COMMAND_ACCEPTED" && event.data?.commandId === command.commandId);
  if (duplicate) throw new Error("Duplicate command");
}

export function commandAcceptedEvent(command: TaskCommand): TaskEvent {
  return {
    taskId: command.taskId,
    event: "COMMAND_ACCEPTED",
    source: "QY_HUB",
    timestamp: command.createdAt,
    data: { commandId: command.commandId, action: command.action },
  };
}
