import { evaluateIntegrationReadiness, type IntegrationHealth } from "./integration-readiness.js";

export type WorkflowKind = "IRD" | "CONCIERGE";

export function assertDispatchReady(kind: WorkflowKind, health: IntegrationHealth): void {
  const readiness = evaluateIntegrationReadiness(health);
  const ready = kind === "IRD" ? readiness.irdReady : readiness.conciergeReady;
  if (ready) return;
  const blockers = kind === "IRD" ? readiness.irdBlockers : readiness.conciergeBlockers;
  throw new Error(`${kind} dispatch blocked: ${blockers.join("; ")}`);
}
