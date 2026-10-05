import type { RobotTask, TaskEvent } from "./domain.js";

export interface StalledTaskAlert {
  taskId: string;
  status: RobotTask["status"];
  stalledForSeconds: number;
  action: "CHECK_ROBOT" | "CHECK_LIFT" | "CHECK_DESTINATION";
}

const limits: Partial<Record<RobotTask["status"], number>> = {
  DISPATCHED: 120,
  IN_TRANSIT: 600,
  WAITING_FOR_LIFT: 180,
  ARRIVED: 300,
};

/** Read-only watchdog: surfaces stalled physical tasks; it never retries commands. */
export function detectStalledTasks(tasks: RobotTask[], events: TaskEvent[], now: string): StalledTaskAlert[] {
  const nowMs = Date.parse(now);
  if (!Number.isFinite(nowMs)) throw new Error("Invalid watchdog timestamp");

  return tasks.flatMap(task => {
    const limit = limits[task.status];
    if (!limit) return [];
    const taskEvents = events.filter(event => event.taskId === task.id);
    const latestMs = Math.max(Date.parse(task.updatedAt), ...taskEvents.map(event => Date.parse(event.timestamp)).filter(Number.isFinite));
    const stalledForSeconds = Math.max(0, Math.floor((nowMs - latestMs) / 1000));
    if (stalledForSeconds < limit) return [];
    return [{
      taskId: task.id,
      status: task.status,
      stalledForSeconds,
      action: task.status === "WAITING_FOR_LIFT" ? "CHECK_LIFT" : task.status === "ARRIVED" ? "CHECK_DESTINATION" : "CHECK_ROBOT",
    }];
  });
}
