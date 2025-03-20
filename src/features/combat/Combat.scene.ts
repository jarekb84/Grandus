import * as Phaser from 'phaser';
import { EnemySystem } from '@/features/combat/Enemy';
import { ProjectileSystem } from '@/features/combat/Projectile';
import { PlayerSystem, PlayerEvents } from '@/features/combat/Player';
import { WaveSystem, WaveEvents } from '@/features/combat/Wave';
import { CombatSystem, CombatEvents } from '@/features/combat/Combat.system';
import { useCurrencyStore } from '@/features/shared/stores/Currency.store';


export interface CombatSceneEvents {
  onWaveComplete: (waveNumber: number, rewards: any) => void;
  onGameOver: (score: number) => void;
  onStatsUpdate: (stats: {
    wave: number;
    enemiesRemaining: number;
    enemyHealth: number;
    enemyDamage: number;
    enemySpeed: number;
  }) => void;
  onAmmoChanged: (ammo: number) => void;
  onOutOfAmmo: () => void;
  onPlayerHealthChanged: (health: number) => void;
}

export class CombatScene extends Phaser.Scene {
  private enemySystem!: EnemySystem;
  private projectileSystem!: ProjectileSystem;
  private playerSystem!: PlayerSystem;
  private waveSystem!: WaveSystem;
  private combatSystem!: CombatSystem;
  private sceneEvents: CombatSceneEvents;
  private readonly PLAYER_Y = 700; // Player's fixed Y position near bottom
  private isGameOver: boolean = false; // Track game over state

  constructor(events: CombatSceneEvents) {
    super({ 
      key: 'CombatScene',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      }
    });
    this.sceneEvents = events;
  }

  setAutoShooting(enabled: boolean) {
    this.combatSystem.setAutoShooting(enabled);
  }

  preload() {
    // We'll create textures in create() instead, similar to MainScene
  }

  create() {
    // Reset game over state when scene is created
    this.isGameOver = false;
    
    // Initialize physics
    this.physics.world.setBounds(0, 0, 1024, 768);
    
    // Ensure physics is running
    this.physics.resume();
    
    // Initialize systems
    this.enemySystem = new EnemySystem(this);
    this.projectileSystem = new ProjectileSystem(this);
    
    // Initialize player system
    const playerEvents: PlayerEvents = {
      onPlayerHealthChanged: this.sceneEvents.onPlayerHealthChanged
    };
    this.playerSystem = new PlayerSystem(this, playerEvents);
    
    // Create player at the bottom center
    const centerX = this.cameras.main.centerX;
    const player = this.playerSystem.createPlayer(centerX, this.PLAYER_Y);
    
    // Initialize wave system
    const waveEvents: WaveEvents = {
      onWaveComplete: this.sceneEvents.onWaveComplete,
      onStatsUpdate: this.sceneEvents.onStatsUpdate
    };
    this.waveSystem = new WaveSystem(this, this.enemySystem, waveEvents);
    
    // Initialize combat system
    const combatEvents: CombatEvents = {
      onAmmoChanged: this.sceneEvents.onAmmoChanged,
      onOutOfAmmo: this.sceneEvents.onOutOfAmmo
    };
    this.combatSystem = new CombatSystem(
      this, 
      this.enemySystem, 
      this.projectileSystem, 
      this.playerSystem,
      this.waveSystem,
      combatEvents
    );
    
    // Start first wave
    this.waveSystem.startNextWave(player.x, player.y);
  }

  override update(time: number) {
    // Skip all updates if game is over
    if (this.isGameOver) return;
    
    // Ensure all systems are initialized
    if (!this.combatSystem || !this.waveSystem || !this.playerSystem) return;
    
    // Update combat system
    const playerDied = this.combatSystem.update(time);
    
    if (playerDied) {
      this.handlePlayerDeath();
      return;
    }
    
    // Check if wave is complete
    if (this.waveSystem.isWaveComplete()) {
      this.waveSystem.completeWave();
      this.waveSystem.startNextWave(
        this.playerSystem.getPlayer().x, 
        this.playerSystem.getPlayer().y
      );
    }
  }
  
  private handlePlayerDeath() {
    // Set game over state
    this.isGameOver = true;
    
    // Stop auto-shooting
    this.combatSystem.setAutoShooting(false);
    
    // Freeze all physics objects (enemies and projectiles)
    this.physics.pause();
    
    // Notify game over with current wave as score
    this.sceneEvents.onGameOver(this.waveSystem.getCurrentWave());
    
    // Reset cash when game is over
    useCurrencyStore.getState().resetCash();
  }
} 
