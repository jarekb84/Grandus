import Phaser from "phaser";

export interface IRespawnProgressVisualizer {
  /**
   * Creates the visual elements for the progress indicator.
   * These should typically be added as children to the nodeGameObject.
   * @param scene The Phaser scene instance.
   * @param nodeGameObject The main sprite representing the resource node.
   */
  create(scene: Phaser.Scene, nodeGameObject: Phaser.GameObjects.Sprite): void;

  /**
   * Starts or updates the progress animation (e.g., a tween).
   * The animation should visually represent progress from 0% to 100%
   * over the specified duration.
   * @param duration The total time in milliseconds for one full respawn cycle animation.
   */
  update(duration: number): void;

  /**
   * Makes the visual elements visible.
   * Should reset any animation progress if called before starting a new update.
   */
  show(): void;

  /**
   * Hides the visual elements and stops any active animation/tween.
   */
  hide(): void;

  /**
   * Cleans up all created visual elements and any associated resources (like tweens).
   */
  destroy(): void;
}
