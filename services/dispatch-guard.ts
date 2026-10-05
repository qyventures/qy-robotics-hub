import { integrationReadiness, type IntegrationName, type IntegrationStatus } from "./integration-readiness.js";

export type WorkflowKind = "IRD" | "CONCIERGE";
export type IntegrationHealth = Record<IntegrationName, IntegrationStatus>;

export function assertDispatchReady(kind: WorkflowKind, health: IntegrationHealth): void {
  const readiness = integrationReadiness(health);
  const ready = kind === "IRD" ? readiness.readyForLiveIrd : readiness.readyForConcierge;
  if (ready) return;

  const required: IntegrationName[] = kind === "IRD"
    ? ["keenon", "otis", "pbx"]
    : ["keenon", "whatsapp"];
  const blockers = readiness.blockers.filter((blocker) => required.some((name) => blocker.startsWith(`${name}:`)));
  throw new Error(`${kind} dispatch blocked: ${blockers.join("; ")}`);
}
