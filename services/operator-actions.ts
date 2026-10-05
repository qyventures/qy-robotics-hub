import type { RobotTask, TaskEvent } from "./domain.js";

export type OperatorAction = "NONE" | "PREPARE_ITEM" | "DISPATCH" | "CHECK_ROBOT" | "CHECK_LIFT" | "HANDOFF" | "ESCALATE";

export interface OperatorActionView {
  taskId: string;
  action: OperatorAction;
  reason: string;
}

/** Converts workflow state into one explicit staff action without issuing physical commands. */
export function nextOperatorAction(task: RobotTask, events: TaskEvent[]): OperatorActionView {
  const ownEvents = events.filter((e) => e.taskId === task.id);
  if (task.status === "FAILED") return { taskId: task.id, action: "ESCALATE", reason: "Task failed; staff intervention required" };
  if (task.status === "CREATED") return { taskId: task.id, action: "PREPARE_ITEM", reason: "Task must be prepared before dispatch" };
  if (task.status === "READY") return { taskId: task.id, action: "DISPATCH", reason: "Task is ready for guarded dispatch" };
  if (task.status === "WAITING_FOR_LIFT") return { taskId: task.id, action: "CHECK_LIFT", reason: "Robot is waiting for lift integration" };
  if (task.status === "ARRIVED") return { taskId: task.id, action: "HANDOFF", reason: "Robot has arrived at destination" };
  if ((task.status === "DISPATCHED" || task.status === "IN_TRANSIT") && ownEvents.some((e) => e.event === "COMMAND_FAILED")) {
    return { taskId: task.id, action: "CHECK_ROBOT", reason: "A physical command failed" };
  }
  return { taskId: task.id, action: "NONE", reason: "No staff action currently required" };
}
