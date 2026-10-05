import type { RobotTask, TaskEvent } from "./domain.js";

export type RecoveryAction = "NONE" | "RETRY_DISPATCH" | "ESCALATE_STAFF" | "CHECK_LIFT";

export interface RecoveryDecision {
  action: RecoveryAction;
  reason: string;
}

/** Deterministic recovery advice only; it never issues a physical robot/lift command. */
export function decideRecovery(task: RobotTask, events: TaskEvent[]): RecoveryDecision {
  if (task.status === "COMPLETED") return { action: "NONE", reason: "Task already completed" };
  if (task.status === "WAITING_FOR_LIFT") return { action: "CHECK_LIFT", reason: "Task is waiting for lift integration" };
  if (task.status === "FAILED") return { action: "ESCALATE_STAFF", reason: "Failed physical task requires staff review before retry" };

  const dispatched = events.some((event) => event.taskId === task.id && event.event === "ROBOT_DISPATCHED");
  if (task.status === "READY" && !dispatched) return { action: "RETRY_DISPATCH", reason: "Ready task has no dispatch event" };

  return { action: "NONE", reason: "No recovery action required" };
}
