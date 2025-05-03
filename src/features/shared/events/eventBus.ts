import mitt, { Emitter } from "mitt";

export type NodeVisualEffect =
  | "depleted"
  | "respawning_pulse"
  | "fully_stocked";

export interface NodeVisualStatePayload {
  nodeId: string;
  activeEffects: NodeVisualEffect[];
}

export interface NodeCapacityDecrementedPayload {
  nodeId: string;
}

export type AppEventMap = {
  NODE_VISUAL_STATE_CHANGED: NodeVisualStatePayload;
  NODE_CAPACITY_DECREMENTED: NodeCapacityDecrementedPayload;
  // Add other application-wide events here as needed
};

export const eventBus: Emitter<AppEventMap> = mitt<AppEventMap>();
