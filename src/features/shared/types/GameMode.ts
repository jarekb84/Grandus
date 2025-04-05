export enum GameMode {
  TERRITORY = "TERRITORY",
  MANAGEMENT = "MANAGEMENT",
  COMBAT = "COMBAT",
}

export interface GameModeConfig {
  mode: GameMode;
}
