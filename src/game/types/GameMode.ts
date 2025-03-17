export enum GameMode {
  GATHERING = 'GATHERING',
  MANAGEMENT = 'MANAGEMENT',
  COMBAT = 'COMBAT'
}

export interface GameModeConfig {
  mode: GameMode;
  // Add any mode-specific configuration here later
} 