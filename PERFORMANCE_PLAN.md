# Performance Optimization Roadmap

This document outlines a phased approach to optimizing the game for large-scale combat scenarios with hundreds of entities and particle effects.

## Performance Testing Results (Initial Baseline)

High entity count stress tests with 25ms shooting interval produced these results:

| Enemy Count | Performance Impact |
|-------------|-------------------|
| 1,000       | Steady 55+ FPS - No noticeable performance impact |
| 2,500       | Steady 55+ FPS - No noticeable performance impact |
| 4,000       | Dips to 41 FPS when shooting - Moderate impact |
| 5,000       | Dips to 33 FPS when shooting - Significant impact |
| 10,000      | Dips to 10 FPS when shooting - Major performance degradation |

**Key Observations:**
- Performance is excellent up to 2,500 entities
- Shooting (creating projectiles) is the primary trigger for performance drops
- Enemy movement causes temporary FPS dips that quickly recover
- Likely bottlenecks: collision detection and nearest enemy search (both O(n²) operations)

## Performance Monitoring

Before implementing any optimizations, add these monitoring tools to establish baselines and track improvements:

- [x] Add FPS counter to combat scene
- [x] Add entity counter display (enemies, projectiles, particles)
- [x] Add simple performance logging to console during development
- [x] Add min/max FPS tracking to identify performance spikes

```typescript
// Simple performance monitor
class PerformanceMonitor {
  private fps = 0;
  private frameTime = 0;
  private entityCount = 0;
  private lastTime = 0;
  private fpsText: Phaser.GameObjects.Text;
  
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
    if (scene.frameCount % 10 === 0) {
      this.fpsText.setText(`FPS: ${this.fps} | Entities: ${this.entityCount}`);
    }
  }
}
```

## Milestone 1: Immediate Optimizations

Implement these improvements immediately to establish the right architectural patterns:

### State Separation

- [x] Establish clear boundaries between Phaser and React state
  - [x] Keep high-frequency state in Phaser (entity positions, health, etc.)
  - [x] Only sync summary data to React/Zustand at reduced frequency

```typescript
// In your combat scene
class CombatScene extends Phaser.Scene {
  private frameCount = 0;
  
  // In your update method
  update(time, delta) {
    // High-frequency updates stay in Phaser
    this.updateEntities(delta);
    
    // Only sync to React/Zustand periodically
    if (this.frameCount % 10 === 0) {
      const store = useCombatStore.getState();
      store.updateStats({
        playerHealth: this.player.health,
        enemiesKilled: this.killCount,
        cash: this.cash
      });
    }
    
    this.frameCount = (this.frameCount + 1) % 60;
  }
}
```

**Why now?** This pattern is fundamental and much harder to retrofit later. It prevents React rendering cycles from bottlenecking game performance.

### Update Frequency Management

- [x] Implement tiered update frequencies for different systems
  - [x] Every frame: Physics, collisions, movement (60fps)
  - [x] Every 3-5 frames: Entity stats, AI decisions (12-20fps)
  - [x] Every 10-15 frames: UI updates, resource counts (4-6fps)

```typescript
update(time, delta) {
  // Every frame (60fps)
  this.updatePhysics(delta);
  this.handleCollisions();
  
  // Every 3 frames (~20fps)
  if (this.frameCount % 3 === 0) {
    this.updateEntityStats();
    this.updateAI();
  }
  
  // Every 10 frames (~6fps)
  if (this.frameCount % 10 === 0) {
    this.syncUIState();
  }
  
  this.frameCount = (this.frameCount + 1) % 60;
}
```

**Why now?** Sets up the foundation for performance optimization and clearly delineates what needs to update at what frequency.

## Milestone 2: Scaling Optimizations

Based on our performance testing, these optimizations should be implemented when the game reaches around 2,000-3,000 entities or when the FPS consistently drops below 45.

### Object Pooling for Projectiles and Particles

- [ ] Implement object pooling for frequently created/destroyed objects
  - [ ] Start with projectiles
  - [ ] Then implement for particles
  - [ ] Finally for enemies when needed

```typescript
class ProjectilePool {
  private pool: Phaser.GameObjects.Sprite[] = [];
  private scene: Phaser.Scene;
  
  constructor(scene: Phaser.Scene, initialSize: number = 50) {
    this.scene = scene;
    // Pre-allocate objects
    for (let i = 0; i < initialSize; i++) {
      const projectile = scene.add.sprite(0, 0, 'projectile');
      projectile.setActive(false).setVisible(false);
      this.pool.push(projectile);
    }
  }
  
  get(x: number, y: number): Phaser.GameObjects.Sprite {
    // Find inactive object or create new one
    let projectile = this.pool.find(p => !p.active);
    if (!projectile) {
      projectile = this.scene.add.sprite(0, 0, 'projectile');
      this.pool.push(projectile);
    }
    
    // Reset and position
    projectile.setPosition(x, y);
    projectile.setActive(true).setVisible(true);
    return projectile;
  }
  
  release(projectile: Phaser.GameObjects.Sprite): void {
    projectile.setActive(false).setVisible(false);
  }
}
```

**Implementation trigger:** When you notice frame rate drops during heavy projectile firing, especially with rapid fire rates (25ms intervals). Based on testing, this should be prioritized when regularly having more than 2,000 entities.

### Group Management for Similar Entities

- [ ] Use Phaser's Group system to efficiently manage similar entities
  - [ ] Group enemies by type
  - [ ] Group projectiles by weapon type

```typescript
// In scene creation
this.enemyGroups = {
  [EnemyType.BASIC]: this.add.group({
    classType: Enemy,
    maxSize: 100
  }),
  [EnemyType.ADVANCED]: this.add.group({
    classType: AdvancedEnemy,
    maxSize: 50
  })
};

// When creating enemies
spawnEnemy(type, x, y) {
  const enemy = this.enemyGroups[type].get(x, y);
  if (enemy) {
    enemy.activate(); // Your custom setup method
  }
}
```

**Implementation trigger:** When you have multiple enemy types or when your enemy count regularly exceeds 2,000-3,000.

## Milestone 3: Large-Scale Optimizations

Implement these when pushing to 4,000+ entities or when FPS drops below 30:

### Spatial Partitioning

- [ ] Implement spatial grid or quad tree for collision optimization
  - [ ] Divide the game world into cells/regions
  - [ ] Only check collisions between entities in the same or adjacent cells

```typescript
class SpatialGrid {
  private cellSize: number;
  private grid: Map<string, Set<Entity>> = new Map();
  
  constructor(cellSize: number = 100) {
    this.cellSize = cellSize;
  }
  
  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }
  
  insert(entity: Entity): void {
    const key = this.getCellKey(entity.x, entity.y);
    if (!this.grid.has(key)) {
      this.grid.set(key, new Set());
    }
    this.grid.get(key)?.add(entity);
  }
  
  getPotentialCollisions(entity: Entity): Entity[] {
    const key = this.getCellKey(entity.x, entity.y);
    const cellKeys = [key]; // Add adjacent cells as needed
    
    // Gather all entities from relevant cells
    const potentialCollisions: Entity[] = [];
    cellKeys.forEach(cellKey => {
      const cell = this.grid.get(cellKey);
      if (cell) {
        cell.forEach(otherEntity => {
          if (otherEntity !== entity) {
            potentialCollisions.push(otherEntity);
          }
        });
      }
    });
    
    return potentialCollisions;
  }
  
  update(entity: Entity, oldX: number, oldY: number): void {
    const oldKey = this.getCellKey(oldX, oldY);
    const newKey = this.getCellKey(entity.x, entity.y);
    
    if (oldKey !== newKey) {
      // Remove from old cell
      this.grid.get(oldKey)?.delete(entity);
      
      // Add to new cell
      if (!this.grid.has(newKey)) {
        this.grid.set(newKey, new Set());
      }
      this.grid.get(newKey)?.add(entity);
    }
  }
}
```

**Implementation trigger:** When your entity count regularly exceeds 4,000 and collision checks are becoming a bottleneck (visible in performance monitoring). This will dramatically improve nearest enemy searches and collision detection at scale.

### Rendering Optimizations

- [ ] Implement sprite batching for similar entities
- [ ] Add simple level-of-detail (LOD) system for distant entities
- [ ] Consider implementing culling for off-screen entities

```typescript
// Simple LOD example
updateEntityVisuals(entity) {
  const distance = Phaser.Math.Distance.Between(
    this.player.x, this.player.y, entity.x, entity.y
  );
  
  if (distance > 500) {
    // Distant: simplified rendering
    entity.setTexture('enemy_simple');
    entity.setScale(0.8);
  } else if (distance > 300) {
    // Medium distance: normal detail
    entity.setTexture('enemy_normal');
    entity.setScale(1.0);
  } else {
    // Close: high detail
    entity.setTexture('enemy_detailed');
    entity.setScale(1.2);
  }
}
```

**Implementation trigger:** When you have 5,000+ entities on screen or when rendering becomes the bottleneck according to browser profiling tools.

## Milestone 4: Advanced Optimizations

Only implement these for very large-scale scenarios (5,000+ entities) or specific performance issues:

### Offload to Web Workers

- [ ] Move complex calculations to Web Workers
  - [ ] Pathfinding
  - [ ] AI decision making
  - [ ] Wave generation

### Use Typed Arrays for Entity Data

- [ ] Replace object properties with typed arrays for core entity data
  - [ ] Positions
  - [ ] Health values
  - [ ] States

### Dynamic Quality Settings

- [ ] Implement automatic quality adjustment based on performance
  - [ ] Adjust particle counts
  - [ ] Adjust enemy count limits
  - [ ] Adjust visual effects

## When to Revisit Performance Optimizations

Based on our stress testing, here are guidelines for when to implement each milestone:

| Milestone | When to Implement |
|-----------|-------------------|
| Milestone 1 | ✅ Already implemented |
| Milestone 2 | When the game regularly features 2,000+ entities<br>When rapid-fire shooting (25ms interval) causes FPS to drop below 45 |
| Milestone 3 | When the game regularly features 4,000+ entities<br>When FPS drops below 30 during normal gameplay |
| Milestone 4 | When the game regularly features 5,000+ entities<br>When earlier optimizations aren't sufficient |

**Recommendation:** Continue developing core gameplay features before implementing Milestone 2 optimizations. The current implementation performs well up to 2,500 entities, which provides plenty of headroom for early gameplay development.

## Performance Thresholds and Monitoring

Use these guidelines to decide when to move to the next optimization milestone:

| Performance Indicator | Threshold | Action |
|-----------------------|-----------|--------|
| FPS below 45 | With 2,000+ entities | Implement Milestone 2 optimizations |
| FPS below 30 | With 4,000+ entities | Implement Milestone 3 optimizations |
| FPS below 20 | With 5,000+ entities | Implement Milestone 4 optimizations |
| Entity creation/destruction causing stutters | Any entity count | Implement object pooling immediately |
| Memory usage growing continuously | Over multiple game sessions | Check for memory leaks and implement object cleanup |

## Notes for Future AI Refactoring Sessions

- Each optimization should be implemented incrementally, with performance measurements before and after
- Maintain the separation between high-frequency game state (in Phaser) and UI state (in React/Zustand)
- When refactoring, preserve the tiered update frequency pattern established in Milestone 1
- The object pooling system should be extended rather than replaced as requirements grow
- Consider moving to a full Entity Component System (ECS) architecture only if the complexity justifies it

Remember that premature optimization can complicate the codebase unnecessarily. Follow the milestones and only implement optimizations when the performance indicators suggest they're needed. 