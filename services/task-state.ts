import type { RobotTask, TaskStatus } from "./domain.js";

const allowed: Record<TaskStatus, TaskStatus[]> = {
  CREATED: ["READY", "FAILED"],
  READY: ["DISPATCHED", "FAILED"],
  DISPATCHED: ["IN_TRANSIT", "WAITING_FOR_LIFT", "FAILED"],
  IN_TRANSIT: ["WAITING_FOR_LIFT", "ARRIVED", "FAILED"],
  WAITING_FOR_LIFT: ["IN_TRANSIT", "FAILED"],
  ARRIVED: ["COMPLETED", "FAILED"],
  COMPLETED: [],
  FAILED: [],
};

export function transitionTask(task: RobotTask, next: TaskStatus, at = new Date().toISOString()): RobotTask {
  if (!allowed[task.status].includes(next)) {
    throw new Error(`Invalid task transition: ${task.status} -> ${next}`);
  }
  return { ...task, status: next, updatedAt: at };
}

export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return allowed[from].includes(to);
}
