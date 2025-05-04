import Phaser from "phaser";
import { IRespawnProgressVisualizer } from "./RespawnProgressVisualizer.types";

const BORDER_COLOR = 0xffd700; // Gold
const BORDER_THICKNESS = 2;
const BORDER_RADIUS_OFFSET = 4; // How much larger the radius is than the node's half-width

export class ClockwiseBorderVisualizer implements IRespawnProgressVisualizer {
  private scene!: Phaser.Scene;
  private nodeGameObject!: Phaser.GameObjects.Sprite;
  private graphics!: Phaser.GameObjects.Graphics;
  private tween: Phaser.Tweens.Tween | null = null;
  private progress: number = 0; // Value from 0 to 1 representing tween progress

  create(scene: Phaser.Scene, nodeGameObject: Phaser.GameObjects.Sprite): void {
    this.scene = scene;
    this.nodeGameObject = nodeGameObject; // Store for potential position updates if needed

    this.graphics = this.scene.add.graphics({
      x: nodeGameObject.x,
      y: nodeGameObject.y,
    });
    // Add the graphics object as a child or ensure it follows the nodeGameObject
    // For simplicity, we'll set position directly. If node moves, this needs updating.
    // A container might be better if nodes move frequently.
    nodeGameObject.parentContainer?.add(this.graphics); // Add to container if node is in one
    if (!nodeGameObject.parentContainer) {
      // If not in a container, it might be directly on the scene.
      // Adding graphics to the scene ensures it's rendered.
      // Consider managing depth if needed.
    }

    this.graphics.setVisible(false); // Start hidden
  }

  update(duration: number): void {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }

    this.progress = 0; // Reset progress before starting tween

    this.tween = this.scene.tweens.add({
      targets: this, // Target the visualizer instance itself to tween the 'progress' property
      progress: 1, // Tween progress from 0 to 1
      duration: duration,
      ease: "Linear", // Use Linear ease for steady progress
      onUpdate: () => {
        this.redrawArc();
      },
      onComplete: () => {
        // Optionally hide or reset graphics on complete, although 'hide' method handles this
        // this.hide(); // Example: hide when the cycle visually completes
        this.tween = null; // Clear tween reference on completion
      },
      onStop: () => {
        // Ensure cleanup if stopped prematurely
        this.tween = null;
      },
    });
  }

  private redrawArc(): void {
    if (!this.graphics || !this.nodeGameObject) return;

    this.graphics.clear();
    this.graphics.lineStyle(BORDER_THICKNESS, BORDER_COLOR, 1); // thickness, color, alpha

    const radius = this.nodeGameObject.displayWidth / 2 + BORDER_RADIUS_OFFSET;
    const startAngle = -90; // Start at the top (12 o'clock)
    const endAngle = startAngle + 360 * this.progress;

    // Draw the arc based on the current progress
    // Need to use radians for Phaser's arc function
    this.graphics.beginPath();
    this.graphics.arc(
      0, // x relative to graphics origin (which is nodeGameObject's center)
      0, // y relative to graphics origin
      radius,
      Phaser.Math.DegToRad(startAngle),
      Phaser.Math.DegToRad(endAngle),
      false, // Draw clockwise
    );
    this.graphics.strokePath();
  }

  show(): void {
    if (!this.graphics) return;
    this.progress = 0; // Reset progress visually
    this.redrawArc(); // Draw the initial state (empty arc or full if progress starts at 1)
    this.graphics.setVisible(true);
  }

  hide(): void {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }
    if (this.graphics) {
      this.graphics.setVisible(false);
      this.graphics.clear(); // Clear any drawn arc
    }
    this.progress = 0; // Reset progress value
  }

  destroy(): void {
    this.hide(); // Stop tween and hide
    if (this.graphics) {
      this.graphics.destroy();
      // Type assertion needed because TS doesn't know it's definitely Graphics
      (this.graphics as Phaser.GameObjects.Graphics | null) = null;
    }
    // Nullify references
    (this.scene as Phaser.Scene | null) = null;
    (this.nodeGameObject as Phaser.GameObjects.Sprite | null) = null;
  }
}
