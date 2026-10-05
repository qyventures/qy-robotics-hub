export interface GuestNotification {
  hotelId: string;
  taskId: string;
  roomNumber?: string;
  recipient?: string;
  message: string;
}

export interface NotificationAdapter {
  readonly channel: "WHATSAPP" | "SMS" | "APP";
  send(notification: GuestNotification): Promise<{ accepted: boolean; reference?: string }>;
}

export class UnconfiguredNotificationAdapter implements NotificationAdapter {
  readonly channel = "WHATSAPP" as const;

  async send(): Promise<{ accepted: boolean }> {
    throw new Error("Guest notification integration is not configured");
  }
}
