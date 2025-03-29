# State Architecture Recommendations

This document outlines recommendations for organizing state and business logic in the game, complementing the performance optimizations in PERFORMANCE_PLAN.md.

## Current State Architecture

The game currently uses:
- Zustand stores for global state (`GameState`, `Resources`, `Currency`)
- Direct store access in game systems
- React components accessing stores via hooks
- Phaser scenes maintaining their own internal state
- Adapter pattern beginning to emerge (`useGatheringAdapter`)

## Core Recommendations

### 1. Domain-Specific Stores

- [ ] Break down the monolithic `GameState` store into specialized stores
  - [ ] `EntityStore` - Base entity registry
  - [ ] `ResourceNodeStore` - Resource node-specific state
  - [ ] `CharacterStore` - Character entities
  - [ ] `CombatStore` - Combat-specific state

```typescript
// Instead of one large GameState store:
export const useEntityStore = create<EntityState>((set) => ({
  // Base entity operations only
}));

export const useResourceNodeStore = create<ResourceNodeState>((set, get) => ({
  // Node-specific operations that can use entityStore internally
}));
```

**Implementation priority**: Start with most actively developed feature area first (likely the combat system).

### 2. Dependency Injection Pattern

- [ ] Inject store dependencies rather than importing them directly
  - [ ] Define interfaces for each store
  - [ ] Pass store interfaces to systems via constructors

```typescript
// Before:
export class ResourceSystem {
  private gameState = useGameState;
  private resourcesStore = useResourcesStore;
  
  // Methods that directly access stores
}

// After:
interface IGameState {
  getEntitiesByType: (type: EntityType) => Entity[];
  // Other methods needed
}

interface IResourceStore {
  addResource: (type: ResourceType, amount: number) => void;
  // Other methods needed
}

export class ResourceSystem {
  constructor(
    private gameState: IGameState,
    private resourceStore: IResourceStore
  ) {}
  
  // Methods that use injected dependencies
}
```

**Why:** This decouples systems from specific implementations, making testing easier and allowing for alternative implementations.

### 3. Service Layer Pattern

- [ ] Create service objects for domain operations
  - [ ] Extract core game logic from systems into services
  - [ ] Make systems orchestrate these services

```typescript
// Extract domain logic to services
export class GatheringService {
  constructor(
    private entityService: EntityService,
    private resourceService: ResourceService
  ) {}
  
  async gatherFromNode(nodeId: string, gatherId: string): Promise<ResourceType[]> {
    // Logic for gathering resources
  }
}

// Systems become orchestrators
export class ResourceSystem {
  constructor(
    private gatheringService: GatheringService,
    private movementService: MovementService
  ) {}
  
  async gatherResource(nodeId: string, gatherId: string) {
    // Coordinate services rather than implementing logic
    await this.movementService.moveEntityTo(gatherId, nodePosition);
    const resources = await this.gatheringService.gatherFromNode(nodeId, gatherId);
    // Trigger effects, animations, etc.
  }
}
```

**Implementation priority**: Start with extracting one core service (like resource gathering) first.

### 4. Standardized Adapter Pattern

- [ ] Create consistent adapter pattern across all features
  - [ ] Define a base adapter interface
  - [ ] Implement adapters for each feature area

```typescript
// Base adapter pattern
interface GameFeatureAdapter<T> {
  connect: (gameRef: MutableRefObject<GameCanvasHandle | null>) => void;
  disconnect: () => void;
  getState: () => T;
}

// Gathering adapter
export interface GatheringAdapter extends GameFeatureAdapter<GatheringState> {
  gatherResource: (type: ResourceType) => Promise<void>;
  hasAvailableNodeType: (nodeType: ResourceNodeType) => boolean;
}

// Combat adapter
export interface CombatAdapter extends GameFeatureAdapter<CombatState> {
  startWave: () => Promise<void>;
  useWeapon: (weaponType: WeaponType) => Promise<void>;
}
```

**Why:** Standardizes how React components communicate with the game engine across features.

### 5. Event Messaging System

- [ ] Implement a formal messaging system between React and Phaser
  - [ ] Create a game event bus
  - [ ] Use pub/sub pattern for communication

```typescript
// Game event system
export class GameEventBus {
  private listeners: Map<string, Set<Function>> = new Map();
  
  subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    // Return unsubscribe function
    return () => this.listeners.get(event)?.delete(callback);
  }
  
  publish(event: string, data?: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => callback(data));
    }
  }
}

// Use in adapters
export const useGatheringAdapter = () => {
  const [state, setState] = useState({ /* initial state */ });
  
  useEffect(() => {
    // Subscribe to relevant events
    const unsubscribe = eventBus.subscribe('resource.gathered', (data) => {
      setState(prev => ({ ...prev, resources: data.resources }));
    });
    
    return unsubscribe;
  }, []);
  
  // Return adapter methods
  return {
    gatherResource: (type) => {
      eventBus.publish('gathering.request', { resourceType: type });
    },
    // Other methods
  };
};
```

**Implementation priority**: Start by implementing this for a single feature area (like combat) first.

## Implementation Order

1. **State Separation** - Start with the pattern defined in PERFORMANCE_PLAN.md for React/Phaser state boundaries
2. **Event Messaging System** - Replace direct function calls with events
3. **Domain-Specific Stores** - Break up monolithic stores
4. **Dependency Injection** - Refactor systems to use injected dependencies
5. **Service Layer** - Extract domain logic to services

## Incremental Implementation Strategy

For each feature area (gathering, combat, management):

1. Implement state separation and event messaging
2. Break out domain-specific store(s) for that feature
3. Refactor systems to use dependency injection
4. Extract domain logic to services
5. Standardize the adapter pattern

Start with the feature area you're actively developing (likely combat) to get the most immediate benefit.

## Notes for Future Refactoring

- These patterns complement the performance optimizations in PERFORMANCE_PLAN.md
- The event messaging system integrates well with the update frequency management in the performance plan
- Domain-specific stores should follow the same separation of high/low frequency state updates
- Consider combining small refactoring steps with feature development rather than doing large-scale rewrites 