import * as Phaser from 'phaser';
import { CombatSceneEvents } from './types';
import { WaveManager } from '../../systems/combat/WaveManager';
import { ProjectileSystem } from '../../systems/combat/ProjectileSystem';
import { EnemyManager } from '../../systems/combat/EnemyManager';
import { PlayerSystem } from '../../systems/combat/PlayerSystem';
import { CombatSystem } from '../../systems/combat/CombatSystem';
import { 
  WaveSystem, 
  ProjectileSystem as IProjectileSystem,
  EnemySystem,
  PlayerSystem as IPlayerSystem,
  CombatSystem as ICombatSystem
} from '../../systems/combat/types';

export class CombatScene extends Phaser.Scene {
  private systems: {
    wave: WaveSystem;
    projectile: IProjectileSystem;
    enemy: EnemySystem;
    player: IPlayerSystem;
    combat: ICombatSystem;
  };

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
    
    // Initialize all systems
    const player = new PlayerSystem(this);
    const projectile = new ProjectileSystem(this);
    const enemy = new EnemyManager(this, events);
    const wave = new WaveManager(events);
    
    this.systems = {
      player,
      projectile,
      enemy,
      wave,
      combat: new CombatSystem(player, projectile, enemy)
    };
  }

  setAutoShooting(enabled: boolean) {
    this.systems.combat.setAutoShooting(enabled);
  }

  override create() {
    // Initialize physics
    this.physics.world.setBounds(0, 0, 1024, 768);

    // Initialize all systems in the correct order
    this.systems.player.create?.();
    this.systems.projectile.create();
    this.systems.enemy.createEnemyTextures();
    this.systems.wave.startNextWave(this.systems.enemy);
  }

  override update(time: number) {
    // Update all systems
    this.systems.combat.update(time);

    // Check for game over condition
    if (this.systems.enemy.hasEnemiesReachedBottom()) {
      const currentWave = this.systems.wave.getCurrentWave();
      this.scene.restart();
    }
  }

  destroy() {
    // Clean up all systems
    Object.values(this.systems).forEach(system => {
      system.destroy?.();
    });
  }
} 