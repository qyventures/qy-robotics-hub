import type { RobotTask, TaskEvent, TaskStatus } from "./domain.js";

export interface TaskHistoryView {
  task: RobotTask;
  events: TaskEvent[];
}

export function taskHistory(task: RobotTask, events: TaskEvent[]): TaskHistoryView {
  return { task, events: events.filter(e => e.taskId === task.id).sort((a, b) => a.timestamp.localeCompare(b.timestamp)) };
}

export function dashboardSummary(tasks: RobotTask[]): { total: number; active: number; completed: number; failed: number; byStatus: Record<string, number> } {
  const byStatus: Record<string, number> = {};
  for (const task of tasks) byStatus[task.status] = (byStatus[task.status] ?? 0) + 1;
  return {
    total: tasks.length,
    active: tasks.filter(t => !(["COMPLETED", "FAILED"] as TaskStatus[]).includes(t.status)).length,
    completed: byStatus.COMPLETED ?? 0,
    failed: byStatus.FAILED ?? 0,
    byStatus,
  };
}
