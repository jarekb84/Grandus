import * as Phaser from "phaser";

export class PerformanceMonitor {
  private fps = 0;
  private minFps = Number.MAX_VALUE;
  private maxFps = 0;
  private frameTime = 0;
  private entityCount = 0;
  private lastTime = 0;
  private fpsText: Phaser.GameObjects.Text;
  private frameCount = 0;
  private startTime = Date.now();
  private resetInterval = 10000; // Reset min/max every 10 seconds

  constructor(scene: Phaser.Scene) {
    this.fpsText = scene.add.text(
      10,
      10,
      "FPS: 0 | Min: 0 | Max: 0 | Entities: 0",
      {
        color: "#00ff00",
        fontSize: "14px",
      },
    );
    this.fpsText.setDepth(1000);
  }

  update(time: number, entityCount: number): void {
    if (this.lastTime > 0) {
      this.frameTime = time - this.lastTime;
      this.fps = Math.round(1000 / this.frameTime);

      this.minFps = Math.min(this.minFps, this.fps);
      this.maxFps = Math.max(this.maxFps, this.fps);
    }
    this.lastTime = time;
    this.entityCount = entityCount;

    // Reset min/max periodically to see recent performance
    if (Date.now() - this.startTime > this.resetInterval) {
      console.log(
        `Performance reset - Min FPS: ${this.minFps}, Max FPS: ${this.maxFps}, Entities: ${this.entityCount}`,
      );
      this.startTime = Date.now();
      this.minFps = Number.MAX_VALUE;
      this.maxFps = 0;
    }

    // Update every 10 frames to avoid text rendering overhead
    if (this.frameCount % 10 === 0) {
      this.fpsText.setText(
        `FPS: ${this.fps} | Min: ${this.minFps === Number.MAX_VALUE ? this.fps : this.minFps} | Max: ${this.maxFps} | Entities: ${this.entityCount}`,
      );
    }

    this.frameCount = (this.frameCount + 1) % 60;
  }
}
