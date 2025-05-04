import Phaser from "phaser";
import { IRespawnProgressVisualizer } from "./RespawnProgressVisualizer.types";

const BORDER_COLOR = 0xffd700; // Gold
const BORDER_THICKNESS = 2;
const START_ANGLE_OFFSET = Math.PI / 2; // Start drawing from the bottom center

export class BottomUpBorderVisualizer implements IRespawnProgressVisualizer {
  private scene!: Phaser.Scene;
  private nodeGameObject!: Phaser.GameObjects.Sprite;
  private graphics!: Phaser.GameObjects.Graphics;
  private tween: Phaser.Tweens.Tween | null = null;
  private radius: number = 0; // Calculated based on nodeGameObject size

  create(scene: Phaser.Scene, nodeGameObject: Phaser.GameObjects.Sprite): void {
    this.scene = scene;
    this.nodeGameObject = nodeGameObject;

    // Calculate radius based on the node sprite's display size, adding padding for the border
    this.radius =
      Math.max(nodeGameObject.displayWidth, nodeGameObject.displayHeight) / 2 +
      BORDER_THICKNESS;

    this.graphics = this.scene.add.graphics({
      x: nodeGameObject.x,
      y: nodeGameObject.y,
    });
    // Add the graphics object as a child or ensure it tracks the node's position if necessary
    // For simplicity, we'll update position manually if needed, or assume it's added to a container
    // If the nodeGameObject moves, this graphics object will need to be updated or parented.
    // Let's assume it's static for now or handled by the scene structure.

    this.hide(); // Start hidden
  }

  update(duration: number): void {
    if (!this.graphics) return;

    // Stop existing tween if running
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }

    // Reset progress visually
    this.graphics.clear();
    this.graphics.setVisible(true); // Ensure visible when update is called

    // Use a proxy object for tweening the progress value
    const tweenTarget = { progress: 0 };

    this.tween = this.scene.tweens.add({
      targets: tweenTarget,
      progress: 1, // Animate progress from 0 to 1
      duration: duration,
      ease: "Linear", // Or another preferred ease
      onUpdate: () => {
        this.drawBorder(tweenTarget.progress);
      },
      onComplete: () => {
        // Optionally hide or reset on completion, though 'hide' is usually triggered by state change event
        // this.hide(); // Or let the state change event handle hiding
        this.tween = null;
        this.graphics.clear();
        this.graphics.setVisible(false);
      },
      onStop: () => {
        this.graphics.clear();
        this.graphics.setVisible(false);
        this.tween = null;
      },
    });
  }

  private drawBorder(progress: number): void {
    if (!this.graphics) return;

    this.graphics.clear();
    this.graphics.lineStyle(BORDER_THICKNESS, BORDER_COLOR, 1); // thickness, color, alpha

    // Calculate start and end angles for symmetrical drawing from the bottom
    const angleExtent = progress * Math.PI; // Total angle covered (0 to PI for a semicircle)
    const startAngle = START_ANGLE_OFFSET - angleExtent;
    const endAngle = START_ANGLE_OFFSET + angleExtent;

    // Draw the arc relative to the graphics object's position (which matches the node's center)
    this.graphics.beginPath();
    this.graphics.arc(
      0, // x relative to graphics origin
      0, // y relative to graphics origin
      this.radius,
      startAngle,
      endAngle,
      false, // Draw counter-clockwise? False for clockwise expansion usually looks right here
    );
    this.graphics.strokePath();
  }

  show(): void {
    if (this.graphics) {
      // Reset visual state to 0% before starting tween in update
      this.graphics.clear();
      // Visibility is handled by update starting the tween
    }
  }

  hide(): void {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }
    if (this.graphics) {
      this.graphics.clear();
      this.graphics.setVisible(false);
    }
  }

  destroy(): void {
    this.hide(); // Stop tween and clear graphics
    if (this.graphics) {
      this.graphics.destroy();
      // Ensure graphics reference is cleared if needed, though class instance destruction handles this
    }
    // Ensure scene reference is cleared if necessary, though typically not required if scene manages lifecycle
  }
}
