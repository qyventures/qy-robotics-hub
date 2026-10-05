export type RobotCapability = "DELIVERY" | "CONCIERGE" | "GUIDANCE";
export type TaskKind = "IRD_DELIVERY" | "CONCIERGE_GUIDE" | "CONCIERGE_SERVICE_REQUEST";
export type TaskStatus = "CREATED" | "READY" | "DISPATCHED" | "IN_TRANSIT" | "WAITING_FOR_LIFT" | "ARRIVED" | "COMPLETED" | "FAILED";

export interface HotelLocation {
  id: string;
  name: string;
  floor: number;
  robotWaypoint: string;
  roomNumber?: string;
}

export interface RobotRecord {
  id: string;
  vendor: "KEENON" | string;
  vendorRobotId: string;
  name: string;
  capabilities: RobotCapability[];
  active: boolean;
}

export interface RobotTask {
  id: string;
  hotelId: string;
  kind: TaskKind;
  robotId?: string;
  originLocationId: string;
  destinationLocationId: string;
  payload?: Record<string, unknown>;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskEvent {
  taskId: string;
  event: string;
  source: "QY_HUB" | "ROBOT" | "LIFT" | "PBX" | "WHATSAPP" | "STAFF";
  timestamp: string;
  data?: Record<string, unknown>;
}
