export type AuditEvent = {
  id: string;
  taskId?: string;
  hotelId: string;
  actor: 'guest' | 'staff' | 'middleware' | 'robot' | 'lift' | 'pbx' | 'whatsapp';
  event: string;
  detail?: Record<string, string | number | boolean | null>;
  createdAt: string;
};

export class AuditLog {
  private events: AuditEvent[] = [];

  append(event: AuditEvent) {
    this.events.push(Object.freeze({ ...event }));
  }

  forTask(taskId: string) {
    return this.events.filter(event => event.taskId === taskId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  forHotel(hotelId: string) {
    return this.events.filter(event => event.hotelId === hotelId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export type TaskHistoryRow = {
  taskId: string;
  type: 'ird_delivery' | 'concierge';
  status: 'queued' | 'assigned' | 'running' | 'completed' | 'failed' | 'cancelled';
  robotId?: string;
  destination?: string;
  requestedAt: string;
  completedAt?: string;
  failureReason?: string;
};

export function recentTaskHistory(rows: TaskHistoryRow[], limit = 100) {
  return [...rows]
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
    .slice(0, Math.max(1, Math.min(limit, 500)));
}
