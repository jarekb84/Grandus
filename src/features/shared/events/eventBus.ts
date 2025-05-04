import mitt, { Emitter } from "mitt";

export type NodeVisualEffect = "empty" | "partial" | "full";

export interface NodeVisualStatePayload {
  nodeId: string;
  activeEffects: NodeVisualEffect[];
}

export interface NodeCapacityDecrementedPayload {
  nodeId: string;
}

export interface NodeRespawnProgressPayload {
  nodeId: string;
  duration: number;
}

export type AppEventMap = {
  NODE_VISUAL_STATE_CHANGED: NodeVisualStatePayload;
  NODE_CAPACITY_DECREMENTED: NodeCapacityDecrementedPayload;
  NODE_RESPAWN_PROGRESS: NodeRespawnProgressPayload;
};

export const eventBus: Emitter<AppEventMap> = mitt<AppEventMap>();
