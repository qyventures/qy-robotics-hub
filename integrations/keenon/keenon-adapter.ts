import type { RobotTask } from "../../services/domain.js";
import type { DispatchResult, RobotAdapter, RobotStatus } from "../robot-adapter.js";
import { IntegrationNotConfiguredError } from "../robot-adapter.js";

export interface KeenonConfig {
  apiBaseUrl?: string;
  apiKey?: string;
  apiSecret?: string;
}

export class KeenonAdapter implements RobotAdapter {
  constructor(private readonly config: KeenonConfig) {}

  async getStatus(_vendorRobotId: string): Promise<RobotStatus> {
    this.assertConfigured();
    throw new Error("Keenon API mapping pending official documentation");
  }

  async dispatch(_task: RobotTask): Promise<DispatchResult> {
    this.assertConfigured();
    throw new Error("Keenon API mapping pending official documentation");
  }

  async cancel(_vendorTaskId: string): Promise<void> {
    this.assertConfigured();
    throw new Error("Keenon API mapping pending official documentation");
  }

  private assertConfigured(): void {
    if (!this.config.apiBaseUrl || !this.config.apiKey || !this.config.apiSecret) {
      throw new IntegrationNotConfiguredError("Keenon");
    }
  }
}
