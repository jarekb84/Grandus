import Phaser from "phaser";
import { IRespawnProgressVisualizer } from "./RespawnProgressVisualizer.types";

const BAR_WIDTH = 30;
const BAR_HEIGHT = 5;
const BAR_Y_OFFSET = 20; // Offset below the node sprite's center
const BACKGROUND_COLOR = 0x555555; // Dark grey
const FILL_COLOR = 0x00ff00; // Green

export class UnderneathBarVisualizer implements IRespawnProgressVisualizer {
  private scene!: Phaser.Scene;
  private nodeGameObject!: Phaser.GameObjects.Sprite;
  private backgroundBar!: Phaser.GameObjects.Rectangle;
  private fillBar!: Phaser.GameObjects.Rectangle;
  private tween: Phaser.Tweens.Tween | null = null;

  create(scene: Phaser.Scene, nodeGameObject: Phaser.GameObjects.Sprite): void {
    this.scene = scene;
    this.nodeGameObject = nodeGameObject;

    const barX = nodeGameObject.x;
    const barY = nodeGameObject.y + BAR_Y_OFFSET;

    // Background bar (full width)
    this.backgroundBar = this.scene.add.rectangle(
      barX,
      barY,
      BAR_WIDTH,
      BAR_HEIGHT,
      BACKGROUND_COLOR,
    );
    this.backgroundBar.setOrigin(0.5, 0.5); // Center origin
    this.backgroundBar.setVisible(false); // Initially hidden

    // Fill bar (starts at 0 width via scaleX)
    this.fillBar = this.scene.add.rectangle(
      barX - BAR_WIDTH / 2, // Align left edge with background
      barY,
      BAR_WIDTH,
      BAR_HEIGHT,
      FILL_COLOR,
    );
    this.fillBar.setOrigin(0, 0.5); // Left-center origin for scaling from left
    this.fillBar.scaleX = 0;
    this.fillBar.setVisible(false); // Initially hidden

    // Ensure bars are rendered relative to the node if it moves (though nodes are static for now)
    // If nodes could move, we'd add these to a container or update position in an update loop.
    // For static nodes, setting position once is fine.
  }

  update(duration: number): void {
    if (this.tween) {
      this.tween.stop();
    }

    // Reset scale before starting tween
    this.fillBar.scaleX = 0;

    this.tween = this.scene.tweens.add({
      targets: this.fillBar,
      scaleX: 1,
      duration: duration, // Use the provided duration
      ease: "Linear", // Simple linear progress
      onComplete: () => {
        this.tween = null;
        // Optionally hide or reset after completion, but hide() handles this
      },
    });
  }

  show(): void {
    this.backgroundBar.setVisible(true);
    this.fillBar.setVisible(true);
    // Reset visual state to 0% before starting tween in update()
    this.fillBar.scaleX = 0;
    if (this.tween) {
      this.tween.stop(); // Stop any existing tween before showing/updating
      this.tween = null;
    }
  }

  hide(): void {
    this.backgroundBar.setVisible(false);
    this.fillBar.setVisible(false);
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }
    // Ensure scale is reset when hidden
    this.fillBar.scaleX = 0;
  }

  destroy(): void {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }
    this.backgroundBar.destroy();
    this.fillBar.destroy();
  }
}
