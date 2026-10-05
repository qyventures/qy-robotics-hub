import type { RobotCapability, RobotRecord, RobotTask } from "./domain.js";

function requiredCapability(task: RobotTask): RobotCapability {
  return task.kind === "IRD_DELIVERY" ? "DELIVERY" : "CONCIERGE";
}

/** Selects an active compatible robot that is not already assigned to an active task. */
export function selectRobot(task: RobotTask, robots: RobotRecord[], activeTasks: RobotTask[]): RobotRecord {
  const capability = requiredCapability(task);
  const busy = new Set(activeTasks.filter(t => !["COMPLETED", "FAILED"].includes(t.status)).map(t => t.robotId).filter(Boolean));
  const eligible = robots
    .filter(r => r.active && r.capabilities.includes(capability) && !busy.has(r.id))
    .sort((a, b) => a.id.localeCompare(b.id));
  if (!eligible.length) throw new Error(`No available robot with ${capability} capability`);
  return eligible[0];
}
