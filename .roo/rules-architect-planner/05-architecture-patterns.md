# Core Architecture Principles (SOLID)

## Single Responsibility
- Each file: one primary purpose/reason to change.
- Decompose components handling multiple concerns (UI rendering, state management, event handling, data transformation, business logic, API calls, game mechanics).

## Open/Closed & Extension
- Design for extension without modification.
- Favor composition over inheritance.
- Use plugin-like architectures; define clear interfaces.

# Functional Design & Testability

- **Prioritize Pure Functions:** Aim for predictable functions (same input -> same output, no side effects).
- **Isolate Side Effects:** Confine necessary side effects (state updates, API calls, scene manipulations) to specific, clearly marked modules/functions.
- **Simple Signatures & Adapters:**
    - Pass only necessary primitives (string, number) or small DTOs to core logic functions.
    - **AVOID passing large/complex objects** (state stores, Phaser GameObjects).
    - Use dedicated **adapter/glue code** to extract/transform simple data from complex objects *before* calling core logic.
- **Benefits:** Improves Testability, Reduces Coupling, Enhances Reusability, Simplifies Reasoning.

# State Management & Communication

*   **State Separation Principle:** CRITICAL - Keep high-frequency game state (positions, physics) in Phaser scenes. Sync only low-frequency/summary UI state to React/Zustand periodically (e.g., 10-15 frames). (Ref: PERFORMANCE_PLAN.MD, STATE_ARCHITECTURE.MD)
*   **Communication:** Use a central **Event Bus** for React <-> Phaser decoupling. Use **Adapter Pattern** (`useCombatAdapter`, `useTerritoryAdapter`) for standardized React interaction with Phaser features. (Ref: STATE_ARCHITECTURE.MD)
*   **Zustand Stores:** Prefer smaller, **domain-specific stores** (`ResourceStore`, `CombatStore`) over monolithic ones. (Ref: STATE_ARCHITECTURE.MD)

## General State Principles
- Keep state local where possible.
- Lift state only when necessary.
- Use context for intermediate sharing.
- Prefer composition over prop drilling.

## Global State (Zustand)
- Persistent game data (inventory, progression, settings).
- Use domain-specific stores with clear boundaries.

## Local State
- Component-specific UI state (temp feedback, form inputs).

## Game State
- Active session data (run stats).
- High-frequency, scene-specific state within Phaser.

# Cross-Feature Communication

## Adapter Pattern for Shared Functionality

When functionality needs to be shared across features:
- Place shared functionality in its own feature directory
- Create feature-specific adapters in each consuming feature
- Use subdirectories named after the shared feature for adapters

```
src/
  features/
    inventory/                 # Shared feature
      Inventory.store.ts       # Core data model

    combat/                    # Consumer feature
      inventory/               # Combat's adapter for inventory
        useCombatItems.ts      # Combat-specific adapter
```

## Key Principles
1. **Direction**: Features depend on shared features, not vice-versa.
2. **Adaptation**: Each feature adapts shared logic via its adapter.
3. **Encapsulation**: Interaction occurs only through adapters.
4. **Independence**: Features are unaware of other consuming features.

# Technology Responsibilities

## Phaser (Game Engine)
- Game world elements
- Physics and collision
- Resource mechanics
- Combat systems
- Particle effects and visual feedback
- Scene management
- Asset loading

## React (UI Layer)
- User interface
- Stats display
- Menus and settings
- Configuration
- Visual feedback

# Performance Guidelines
- React.memo() for expensive renders
- Object pooling in Phaser
- Batch state updates
- Minimize React-Phaser communication
- Optimize Phaser: scene management, object pooling, sprite sheets/atlases, physics groups, multiple scenes.