import Phaser from "phaser";
import { IRespawnProgressVisualizer } from "./RespawnProgressVisualizer.types";

type VisualizerConstructor = new () => IRespawnProgressVisualizer;

export class RespawnVisualizerManager {
  private scene: Phaser.Scene;
  private registeredVisualizers: Map<string, VisualizerConstructor> = new Map();
  private activeVisualizers: Map<string, IRespawnProgressVisualizer> =
    new Map(); // nodeId -> instance

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Registers a visualizer class constructor for a given type key.
   * @param type A unique string identifier for the visualizer type (e.g., 'clockwiseBorder').
   * @param visualizerClass The constructor of the class implementing IRespawnProgressVisualizer.
   */
  registerVisualizer(
    type: string,
    visualizerClass: VisualizerConstructor,
  ): void {
    if (this.registeredVisualizers.has(type)) {
      console.warn(
        `RespawnVisualizerManager: Visualizer type "${type}" is already registered. Overwriting.`,
      );
    }
    this.registeredVisualizers.set(type, visualizerClass);
  }

  /**
   * Returns an array of the keys (type identifiers) for all registered visualizers.
   * @returns An array of strings.
   */
  getRegisteredVisualizerKeys(): string[] {
    return Array.from(this.registeredVisualizers.keys());
  }
  /**
   * Creates and initializes a visualizer instance for a specific node.
   * @param type The type identifier of the visualizer to create.
   * @param nodeId The unique ID of the node entity.
   * @param nodeGameObject The Phaser GameObject representing the node.
   * @returns The created visualizer instance, or undefined if the type is not registered.
   */
  createVisualizer(
    type: string,
    nodeId: string,
    nodeGameObject: Phaser.GameObjects.Sprite,
  ): IRespawnProgressVisualizer | undefined {
    const VisualizerClass = this.registeredVisualizers.get(type);
    if (!VisualizerClass) {
      console.warn(
        `RespawnVisualizerManager: No visualizer registered for type "${type}".`,
      );
      return undefined;
    }

    if (this.activeVisualizers.has(nodeId)) {
      console.warn(
        `RespawnVisualizerManager: Visualizer already exists for node "${nodeId}". Removing existing one.`,
      );
      this.removeVisualizer(nodeId);
    }

    try {
      const instance = new VisualizerClass();
      instance.create(this.scene, nodeGameObject);
      this.activeVisualizers.set(nodeId, instance);
      return instance;
    } catch (error) {
      console.error(
        `RespawnVisualizerManager: Error creating visualizer type "${type}" for node "${nodeId}":`,
        error,
      );
      return undefined;
    }
  }

  /**
   * Retrieves the active visualizer instance for a given node ID.
   * @param nodeId The ID of the node.
   * @returns The visualizer instance, or undefined if none exists for that node.
   */
  getVisualizer(nodeId: string): IRespawnProgressVisualizer | undefined {
    return this.activeVisualizers.get(nodeId);
  }

  /**
   * Destroys and removes the visualizer instance associated with a node ID.
   * @param nodeId The ID of the node whose visualizer should be removed.
   */
  removeVisualizer(nodeId: string): void {
    const instance = this.activeVisualizers.get(nodeId);
    if (instance) {
      try {
        instance.destroy();
      } catch (error) {
        console.error(
          `RespawnVisualizerManager: Error destroying visualizer for node "${nodeId}":`,
          error,
        );
      }
      this.activeVisualizers.delete(nodeId);
    }
  }

  /**
   * Destroys all active visualizers managed by this instance.
   * Useful for scene shutdown.
   */
  destroyAll(): void {
    this.activeVisualizers.forEach((instance, nodeId) => {
      try {
        instance.destroy();
      } catch (error) {
        console.error(
          `RespawnVisualizerManager: Error destroying visualizer for node "${nodeId}" during destroyAll:`,
          error,
        );
      }
    });
    this.activeVisualizers.clear();
    this.registeredVisualizers.clear();
  }
}
