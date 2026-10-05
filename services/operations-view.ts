import type { RobotTask, TaskEvent } from "./domain.js";

export interface OperationsTaskRow {
  taskId: string;
  kind: RobotTask["kind"];
  status: RobotTask["status"];
  robotId?: string;
  destinationLocationId: string;
  lastEvent?: string;
  lastEventAt?: string;
  needsStaffAttention: boolean;
}

/** Dashboard-safe projection for hotel operations. Payload/guest details are intentionally excluded. */
export function buildOperationsTaskRows(tasks: RobotTask[], events: TaskEvent[], hotelId: string): OperationsTaskRow[] {
  return tasks
    .filter(task => task.hotelId === hotelId)
    .map(task => {
      const taskEvents = events.filter(event => event.taskId === task.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      const latest = taskEvents[0];
      return {
        taskId: task.id,
        kind: task.kind,
        status: task.status,
        ...(task.robotId ? { robotId: task.robotId } : {}),
        destinationLocationId: task.destinationLocationId,
        ...(latest ? { lastEvent: latest.event, lastEventAt: latest.timestamp } : {}),
        needsStaffAttention: task.status === "FAILED" || (latest?.event ?? "").includes("STAFF_ESCALATION"),
      };
    })
    .sort((a, b) => (b.lastEventAt ?? "").localeCompare(a.lastEventAt ?? ""));
}
