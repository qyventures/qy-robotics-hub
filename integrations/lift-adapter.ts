export interface LiftRideRequest {
  taskId: string;
  pickupFloor: number;
  destinationFloor: number;
}

export interface LiftRideResult {
  requestId: string;
  accepted: boolean;
}

export interface LiftAdapter {
  requestRide(input: LiftRideRequest): Promise<LiftRideResult>;
  getCurrentFloor(requestId: string): Promise<number | null>;
  getDoorState(requestId: string): Promise<"OPEN" | "CLOSED" | "UNKNOWN">;
  cancel?(requestId: string): Promise<void>;
}
