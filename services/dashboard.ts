import type { RobotTask } from "./domain.js";

export interface DashboardSummary {
  total: number;
  active: number;
  completed: number;
  failed: number;
  waitingForLift: number;
  byKind: Record<string, number>;
}

export function dashboardSummary(tasks: RobotTask[]): DashboardSummary {
  const terminal = new Set(["COMPLETED", "FAILED"]);
  return {
    total: tasks.length,
    active: tasks.filter((task) => !terminal.has(task.status)).length,
    completed: tasks.filter((task) => task.status === "COMPLETED").length,
    failed: tasks.filter((task) => task.status === "FAILED").length,
    waitingForLift: tasks.filter((task) => task.status === "WAITING_FOR_LIFT").length,
    byKind: tasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.kind] = (acc[task.kind] ?? 0) + 1;
      return acc;
    }, {}),
  };
}
