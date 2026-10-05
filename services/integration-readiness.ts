export type IntegrationName = "keenon" | "otis" | "pbx" | "whatsapp";

export interface IntegrationStatus {
  configured: boolean;
  healthy?: boolean;
  detail?: string;
}

export interface ReadinessReport {
  readyForLiveIrd: boolean;
  readyForConcierge: boolean;
  blockers: string[];
}

export function integrationReadiness(status: Record<IntegrationName, IntegrationStatus>): ReadinessReport {
  const usable = (name: IntegrationName) => status[name].configured && status[name].healthy === true;
  const blockers: string[] = [];
  for (const name of ["keenon", "otis", "pbx", "whatsapp"] as IntegrationName[]) {
    if (!status[name].configured) blockers.push(`${name}: configuration missing`);
    else if (status[name].healthy !== true) blockers.push(`${name}: health check not passing`);
  }

  return {
    readyForLiveIrd: usable("keenon") && usable("otis") && usable("pbx"),
    readyForConcierge: usable("keenon") && usable("whatsapp"),
    blockers,
  };
}
