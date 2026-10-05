import type { RobotTask } from "./domain.js";

export function createIrdDeliveryTask(input: {
  id: string;
  hotelId: string;
  originLocationId: string;
  destinationLocationId: string;
  items: string[];
}): RobotTask {
  const now = new Date().toISOString();
  return {
    id: input.id,
    hotelId: input.hotelId,
    kind: "IRD_DELIVERY",
    originLocationId: input.originLocationId,
    destinationLocationId: input.destinationLocationId,
    payload: { items: input.items },
    status: "CREATED",
    createdAt: now,
    updatedAt: now,
  };
}

export function createConciergeGuideTask(input: {
  id: string;
  hotelId: string;
  originLocationId: string;
  destinationLocationId: string;
  requestText?: string;
}): RobotTask {
  const now = new Date().toISOString();
  return {
    id: input.id,
    hotelId: input.hotelId,
    kind: "CONCIERGE_GUIDE",
    originLocationId: input.originLocationId,
    destinationLocationId: input.destinationLocationId,
    payload: input.requestText ? { requestText: input.requestText } : undefined,
    status: "CREATED",
    createdAt: now,
    updatedAt: now,
  };
}
