export interface PbxNotificationRequest {
  hotelId: string;
  roomNumber: string;
  message?: string;
}

export interface PbxAdapter {
  readonly name: string;
  notifyRoom(request: PbxNotificationRequest): Promise<{ accepted: boolean; reference?: string }>;
}

export class UnconfiguredPbxAdapter implements PbxAdapter {
  readonly name = "UNCONFIGURED";

  async notifyRoom(): Promise<{ accepted: boolean }> {
    throw new Error("PBX integration is not configured for this hotel");
  }
}
