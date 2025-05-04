import Phaser from "phaser";
import { IRespawnProgressVisualizer } from "./RespawnProgressVisualizer.types";

export class ColorShiftingBorderVisualizer
  implements IRespawnProgressVisualizer
{
  private scene!: Phaser.Scene;
  private borderArc!: Phaser.GameObjects.Arc;
  private tween: Phaser.Tweens.Tween | null = null;
  private nodeGameObject!: Phaser.GameObjects.Sprite;

  // Define the color gradient
  private readonly startColor = Phaser.Display.Color.ValueToColor(0xff0000); // Red
  private readonly midColor = Phaser.Display.Color.ValueToColor(0xffff00); // Yellow
  private readonly endColor = Phaser.Display.Color.ValueToColor(0x00ff00); // Green

  create(scene: Phaser.Scene, nodeGameObject: Phaser.GameObjects.Sprite): void {
    this.scene = scene;
    this.nodeGameObject = nodeGameObject;

    // Determine radius based on node size, add padding
    const radius =
      Math.max(nodeGameObject.width, nodeGameObject.height) / 2 + 4;
    const lineWidth = 2; // Adjust border thickness as needed

    this.borderArc = this.scene.add.arc(
      0, // Position relative to the parent container (nodeGameObject)
      0,
      radius,
      0, // Start angle
      360, // End angle
      false, // Close path (doesn't matter for full circle)
    );
    this.borderArc.setStrokeStyle(lineWidth, this.startColor.color); // Start with red
    this.borderArc.setFillStyle(); // No fill

    // Add the arc to the nodeGameObject container if it's a container,
    // otherwise add it directly to the scene and manage position manually.
    // Assuming nodeGameObject might be a Sprite, let's add to scene for now
    // and update position if the node moves. For simplicity, let's assume
    // nodes are static for now or handle position updates elsewhere.
    this.borderArc.setPosition(nodeGameObject.x, nodeGameObject.y);

    this.borderArc.setVisible(false); // Start hidden
    // Add to the same display list / depth as the node?
    // this.borderArc.setDepth(nodeGameObject.depth); // Match depth or adjust as needed
  }

  update(duration: number): void {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }

    // Reset color to start
    this.borderArc.setStrokeStyle(
      this.borderArc.lineWidth,
      this.startColor.color,
    );

    // Use a proxy object to tween a value from 0 to 1
    const tweenProxy = { value: 0 };

    this.tween = this.scene.tweens.add({
      targets: tweenProxy,
      value: 1,
      duration: duration,
      ease: "Linear", // Or Phaser.Math.Easing.Linear
      onUpdate: () => {
        let interpolatedColorObject: Phaser.Types.Display.ColorObject;
        const progress = tweenProxy.value; // Current progress (0 to 1)

        // Interpolate color: Red -> Yellow (0 to 0.5), Yellow -> Green (0.5 to 1)
        if (progress <= 0.5) {
          // Interpolate between Red and Yellow
          interpolatedColorObject =
            Phaser.Display.Color.Interpolate.ColorWithColor(
              this.startColor,
              this.midColor,
              1, // Range is 1 for this function
              progress * 2, // Scale progress to 0-1 for this half
            );
        } else {
          // Interpolate between Yellow and Green
          interpolatedColorObject =
            Phaser.Display.Color.Interpolate.ColorWithColor(
              this.midColor,
              this.endColor,
              1, // Range is 1 for this function
              (progress - 0.5) * 2, // Scale progress to 0-1 for this half
            );
        }

        // Convert the ColorObject to a Color instance, then get the number
        const finalColor = Phaser.Display.Color.ObjectToColor(
          interpolatedColorObject,
        );
        this.borderArc.setStrokeStyle(
          this.borderArc.lineWidth,
          finalColor.color,
        );
      },
      onComplete: () => {
        this.tween = null;
        // Optionally set final color explicitly if needed
        // this.borderArc.setStrokeStyle(this.borderArc.lineWidth, this.endColor.color);
      },
    });
  }

  show(): void {
    // Reset color before showing and starting tween
    this.borderArc.setStrokeStyle(
      this.borderArc.lineWidth,
      this.startColor.color,
    );
    this.borderArc.setVisible(true);
  }

  hide(): void {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }
    this.borderArc.setVisible(false);
  }

  destroy(): void {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }
    this.borderArc.destroy();
  }
}
