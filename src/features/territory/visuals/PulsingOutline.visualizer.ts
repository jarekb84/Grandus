import * as Phaser from "phaser";
import { IRespawnProgressVisualizer } from "./RespawnProgressVisualizer.types";

export class PulsingOutlineVisualizer implements IRespawnProgressVisualizer {
  private scene!: Phaser.Scene;
  private nodeGameObject!: Phaser.GameObjects.Sprite;
  private outlineArc!: Phaser.GameObjects.Arc;
  private tween?: Phaser.Tweens.Tween;

  create(scene: Phaser.Scene, nodeGameObject: Phaser.GameObjects.Sprite): void {
    this.scene = scene;
    this.nodeGameObject = nodeGameObject;

    const radius = nodeGameObject.displayWidth / 2 + 4; // Slightly larger than the node
    const lineWidth = 2;
    const color = 0xffaa00; // Orange/Gold color

    this.outlineArc = this.scene.add.arc(
      nodeGameObject.x,
      nodeGameObject.y,
      radius,
      0, // startAngle
      360, // endAngle
      false, // anticlockwise
      undefined, // fillColor (none)
      lineWidth,
    );
    this.outlineArc.setStrokeStyle(lineWidth, color, 1); // Set stroke style explicitly
    this.outlineArc.setDepth(nodeGameObject.depth - 1); // Ensure it's behind the main node sprite slightly
    this.outlineArc.setVisible(false); // Start hidden
    this.outlineArc.setActive(false);
  }

  update(duration: number): void {
    if (!this.outlineArc) return;

    // Stop existing tween if running
    if (this.tween?.isPlaying()) {
      this.tween.stop();
    }

    // Reset scale before starting new tween
    this.outlineArc.setScale(0.8);
    this.outlineArc.setAlpha(0.5);

    // Create a new tween for pulsing effect
    // Duration here is for one pulse cycle (scale out and back in)
    // We'll repeat this indefinitely while shown
    this.tween = this.scene.tweens.add({
      targets: this.outlineArc,
      scale: 1.2,
      alpha: 1.0,
      duration: duration / 2, // Half the respawn duration for one pulse out
      ease: "Sine.easeInOut",
      yoyo: true, // Scale back down
      repeat: -1, // Repeat indefinitely
    });
  }

  show(): void {
    if (this.outlineArc) {
      this.outlineArc.setVisible(true);
      this.outlineArc.setActive(true);
      // Tween is started in update()
    }
  }

  hide(): void {
    if (this.outlineArc) {
      this.outlineArc.setVisible(false);
      this.outlineArc.setActive(false);
      if (this.tween?.isPlaying()) {
        this.tween.stop();
      }
      // Reset properties for next show
      this.outlineArc.setScale(1);
      this.outlineArc.setAlpha(1);
    }
  }

  destroy(): void {
    if (this.tween?.isPlaying()) {
      this.tween.stop();
      // No need to assign undefined with exactOptionalPropertyTypes
    }
    if (this.outlineArc) {
      this.outlineArc.destroy();
      // No need to explicitly nullify, garbage collection handles it
    }
  }
}
