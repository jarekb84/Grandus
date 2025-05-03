import mitt, { Emitter } from "mitt";

export type NodeVisualEffect =
  | "depleted"
  | "respawning_pulse"
  | "fully_stocked";

export interface NodeVisualStatePayload {
  nodeId: string;
  activeEffects: NodeVisualEffect[];
}

export type AppEventMap = {
  NODE_VISUAL_STATE_CHANGED: NodeVisualStatePayload;
  // Add other application-wide events here as needed
};

export const eventBus: Emitter<AppEventMap> = mitt<AppEventMap>();
