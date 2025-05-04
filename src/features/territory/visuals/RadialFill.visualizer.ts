import Phaser from "phaser";
import { IRespawnProgressVisualizer } from "./RespawnProgressVisualizer.types";

const FILL_COLOR = 0xffd700; // Gold, as used in other visualizers
const FILL_ALPHA = 0.7;
const RADIUS_PERCENTAGE = 0.8; // Relative to the node's width/2

export class RadialFillVisualizer implements IRespawnProgressVisualizer {
  private scene!: Phaser.Scene;
  private graphics!: Phaser.GameObjects.Graphics;
  private nodeSprite!: Phaser.GameObjects.Sprite;
  private currentTween: Phaser.Tweens.Tween | null = null;
  private radius: number = 0;

  create(scene: Phaser.Scene, nodeGameObject: Phaser.GameObjects.Sprite): void {
    this.scene = scene;
    this.nodeSprite = nodeGameObject;
    this.radius = (nodeGameObject.width / 2) * RADIUS_PERCENTAGE;

    this.graphics = scene.add.graphics({
      x: nodeGameObject.x,
      y: nodeGameObject.y,
    });
    // Add graphics as a child or ensure it follows the sprite
    // If the nodeGameObject might move, parenting or updating position is needed.
    // For simplicity assuming static nodes for now, matching other visualizers.
    // If nodes move, we might need to update graphics position in scene's update loop
    // or parent it if TerritoryManager handles that.

    this.hide(); // Start hidden
  }

  update(duration: number): void {
    if (this.currentTween) {
      this.currentTween.stop();
      this.currentTween = null;
    }

    // Reset visual state before starting
    this.graphics.clear();
    this.graphics.fillStyle(FILL_COLOR, FILL_ALPHA);
    // Draw a tiny initial slice to avoid flicker if needed, or handle in tween start
    // this.graphics.slice(0, 0, this.radius, 0, Phaser.Math.DegToRad(0.1), true);

    const tweenTarget = { angle: 0 }; // Use a proxy object for tweening

    this.currentTween = this.scene.tweens.add({
      targets: tweenTarget,
      angle: 360,
      duration: duration,
      ease: "Linear", // Use Linear for steady progress
      onUpdate: () => {
        this.graphics.clear();
        this.graphics.fillStyle(FILL_COLOR, FILL_ALPHA);
        // Draw slice from top (0 degrees = 3 o'clock, so startAngle -90 degrees = 12 o'clock)
        this.graphics.slice(
          0, // x relative to graphics origin
          0, // y relative to graphics origin
          this.radius,
          Phaser.Math.DegToRad(-90), // Start angle (12 o'clock)
          Phaser.Math.DegToRad(tweenTarget.angle - 90), // End angle
          false, // Draw clockwise
        );
        // Fill the drawn slice path
        this.graphics.fillPath();
      },
      onComplete: () => {
        // Optionally clear or hide graphics on complete, though hide() will likely handle this
        this.currentTween = null;
      },
    });
  }

  show(): void {
    this.graphics.setVisible(true);
    // Ensure visual state is reset if needed before update is called
    this.graphics.clear();
  }

  hide(): void {
    this.graphics.setVisible(false);
    this.graphics.clear(); // Clear any residual drawing
    if (this.currentTween) {
      this.currentTween.stop();
      this.currentTween = null;
    }
  }

  destroy(): void {
    if (this.currentTween) {
      this.currentTween.stop();
      this.currentTween = null;
    }
    if (this.graphics) {
      this.graphics.destroy();
      // Make sure scene reference is cleaned up if necessary, though TS garbage collection should handle it.
    }
  }
}
