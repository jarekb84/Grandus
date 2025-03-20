import { GameMode, GameModeConfig } from '@/features/shared/types/GameMode';

export interface GameModeManagerEvents {
  onModeChange: (mode: GameMode) => void;
}

export class GameModeManager {
  private currentMode: GameMode = GameMode.GATHERING;
  private game: Phaser.Game;
  private events: GameModeManagerEvents;

  constructor(game: Phaser.Game, events: GameModeManagerEvents) {
    this.game = game;
    this.events = events;
  }

  getCurrentMode(): GameMode {
    return this.currentMode;
  }

  async switchMode(config: GameModeConfig): Promise<void> {
    // Don't switch if we're already in this mode
    if (this.currentMode === config.mode) {
      return;
    }

    // Stop current scene
    switch (this.currentMode) {
      case GameMode.GATHERING:
        this.game.scene.stop('MainScene');
        break;
      case GameMode.COMBAT:
        this.game.scene.stop('CombatScene');
        break;
      case GameMode.MANAGEMENT:
        // Management mode is handled by React, nothing to stop
        break;
    }

    // Start new scene/mode
    this.currentMode = config.mode;
    
    switch (config.mode) {
      case GameMode.GATHERING:
        this.game.scene.start('MainScene');
        break;
      case GameMode.COMBAT:
        this.game.scene.start('CombatScene');
        break;
      case GameMode.MANAGEMENT:
        // Management mode is handled by React
        break;
    }

    // Notify listeners of mode change
    this.events.onModeChange(config.mode);
  }
} 