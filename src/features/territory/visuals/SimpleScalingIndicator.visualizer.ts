import Phaser from "phaser";
import { IRespawnProgressVisualizer } from "./RespawnProgressVisualizer.types";

const INDICATOR_WIDTH = 8;
const INDICATOR_HEIGHT = 20;
const INDICATOR_COLOR = 0x00ff00; // Green color
const OFFSET_X = 25; // Position to the right of the node center
const OFFSET_Y = 0; // Vertically centered with the node

export class SimpleScalingIndicatorVisualizer
  implements IRespawnProgressVisualizer
{
  private scene!: Phaser.Scene;
  private indicator!: Phaser.GameObjects.Rectangle;
  private tween?: Phaser.Tweens.Tween | undefined; // Allow undefined explicitly
  private nodeGameObject!: Phaser.GameObjects.Sprite;

  create(scene: Phaser.Scene, nodeGameObject: Phaser.GameObjects.Sprite): void {
    this.scene = scene;
    this.nodeGameObject = nodeGameObject;

    // Calculate position relative to the node sprite
    const x = nodeGameObject.x + OFFSET_X;
    const y = nodeGameObject.y + OFFSET_Y;

    this.indicator = this.scene.add.rectangle(
      x,
      y,
      INDICATOR_WIDTH,
      INDICATOR_HEIGHT,
      INDICATOR_COLOR,
    );
    this.indicator.setOrigin(0.5, 1); // Set origin to bottom-center for scaling up
    this.indicator.setScale(1, 0); // Use setScale(x, y)
    this.indicator.setVisible(false); // Initially hidden

    // Add the indicator to the same container or depth as the node if necessary
    // If nodeGameObject has a container, add to that:
    if (nodeGameObject.parentContainer) {
      nodeGameObject.parentContainer.add(this.indicator);
    }
    // Ensure it's rendered appropriately relative to the node
    this.indicator.setDepth(nodeGameObject.depth + 1);
  }

  update(duration: number): void {
    if (!this.indicator || !this.scene) return;

    // Stop existing tween if running
    if (this.tween) {
      this.tween.stop();
      this.tween = undefined;
    }

    // Reset scale before starting
    this.indicator.setScale(1, 0); // Use setScale(x, y)
    this.indicator.setVisible(true); // Make sure it's visible for the tween

    // Create new tween
    this.tween = this.scene.tweens.add({
      targets: this.indicator,
      scaleY: 1,
      duration: duration, // Use the provided duration
      ease: "Linear", // Or another ease function if desired
      onComplete: () => {
        // Optional: handle completion, maybe hide it briefly?
        // For now, just nullify the tween reference
        this.tween = undefined;
      },
    });
  }

  show(): void {
    if (!this.indicator) return;
    // The `update` method handles visibility and resetting scale
    // This method might be redundant if update is always called after show,
    // but we ensure it's visible if called independently.
    this.indicator.setVisible(true);
    // Reset scale here too, in case update isn't called immediately after
    if (!this.tween || !this.tween.isPlaying()) {
      this.indicator.setScale(1, 0); // Use setScale(x, y)
    }
  }

  hide(): void {
    if (!this.indicator) return;

    if (this.tween) {
      this.tween.stop();
      this.tween = undefined;
    }
    this.indicator.setScale(1, 0); // Use setScale(x, y)
    this.indicator.setVisible(false);
  }

  destroy(): void {
    if (this.tween) {
      this.tween.stop();
      this.tween = undefined;
    }
    if (this.indicator) {
      this.indicator.destroy();
      // Explicitly nullify to help GC, though destroy should handle it
      // this.indicator = null;
    }
  }
}
