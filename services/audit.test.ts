import test from "node:test";
import assert from "node:assert/strict";
import { AuditLog, recentTaskHistory } from "./audit.js";

test("audit log isolates task events and returns them chronologically", () => {
  const log = new AuditLog();
  log.append({ id: "2", taskId: "t1", hotelId: "wsg", actor: "robot", event: "arrived", createdAt: "2026-10-05T10:02:00Z" });
  log.append({ id: "1", taskId: "t1", hotelId: "wsg", actor: "middleware", event: "created", createdAt: "2026-10-05T10:00:00Z" });
  log.append({ id: "3", taskId: "other", hotelId: "wsg", actor: "staff", event: "created", createdAt: "2026-10-05T10:01:00Z" });
  assert.deepEqual(log.forTask("t1").map(e => e.event), ["created", "arrived"]);
});

test("hotel audit is newest first and does not leak another hotel", () => {
  const log = new AuditLog();
  log.append({ id: "1", hotelId: "wsg", actor: "middleware", event: "a", createdAt: "2026-10-05T10:00:00Z" });
  log.append({ id: "2", hotelId: "wsg", actor: "lift", event: "b", createdAt: "2026-10-05T10:01:00Z" });
  log.append({ id: "3", hotelId: "other", actor: "middleware", event: "secret", createdAt: "2026-10-05T10:02:00Z" });
  assert.deepEqual(log.forHotel("wsg").map(e => e.event), ["b", "a"]);
});

test("task history is newest first and bounded", () => {
  const rows = [
    { taskId: "1", type: "ird_delivery" as const, status: "completed" as const, requestedAt: "2026-10-05T09:00:00Z" },
    { taskId: "2", type: "concierge" as const, status: "running" as const, requestedAt: "2026-10-05T10:00:00Z" },
  ];
  assert.deepEqual(recentTaskHistory(rows, 1).map(r => r.taskId), ["2"]);
});
