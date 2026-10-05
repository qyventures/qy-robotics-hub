import type { RobotTask } from "../services/domain.js";

export interface RobotStatus {
  vendorRobotId: string;
  online: boolean;
  batteryPercent?: number;
  currentWaypoint?: string;
  state?: string;
}

export interface DispatchResult {
  vendorTaskId: string;
  accepted: boolean;
}

export interface RobotAdapter {
  getStatus(vendorRobotId: string): Promise<RobotStatus>;
  dispatch(task: RobotTask): Promise<DispatchResult>;
  cancel(vendorTaskId: string): Promise<void>;
}

export class IntegrationNotConfiguredError extends Error {
  constructor(integration: string) {
    super(`${integration} integration is not configured`);
  }
}
