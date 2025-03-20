import * as Phaser from 'phaser';

export class PerformanceMonitor {
  private fps = 0;
  private frameTime = 0;
  private entityCount = 0;
  private lastTime = 0;
  private fpsText: Phaser.GameObjects.Text;
  private frameCount = 0;
  
  constructor(scene: Phaser.Scene) {
    this.fpsText = scene.add.text(10, 10, 'FPS: 0 | Entities: 0', { 
      color: '#00ff00', 
      fontSize: '14px' 
    });
    this.fpsText.setDepth(1000);
  }
  
  update(time: number, entityCount: number) {
    if (this.lastTime > 0) {
      this.frameTime = time - this.lastTime;
      this.fps = Math.round(1000 / this.frameTime);
    }
    this.lastTime = time;
    this.entityCount = entityCount;
    
    // Update every 10 frames to avoid text rendering overhead
    if (this.frameCount % 10 === 0) {
      this.fpsText.setText(`FPS: ${this.fps} | Entities: ${this.entityCount}`);
    }
    
    this.frameCount = (this.frameCount + 1) % 60;
  }
} 