# Core Architecture Principles (SOLID)

## Single Responsibility
- Each file should have one primary purpose, one main reason to change.
- Break down complex components when they handle multiple concerns.
- Examples of separate concerns:
  - UI rendering
  - State management
  - Event handling
  - Data transformation
  - Business logic (Game Systems: Core game mechanics)
  - API communication
  - Game mechanics

## Open/Closed & Extension
- Design for extension without modification.
- Use composition over inheritance.
- Implement plugin-like architectures for game systems.
- Define clear interfaces between components.

# Functional Design & Testability

- **Prefer Pure Functions:** Aim for functions that produce the same output for the same inputs and have no side effects where possible.
- **Minimize Side Effects:** Isolate necessary side effects (like state updates, API calls, Phaser scene manipulations) into specific modules or functions, clearly demarcating them.
- **Simple Function Signatures:**
    - Avoid passing large, complex objects (e.g., entire state stores, complex entity instances like Phaser GameObjects) directly into core logic functions.
    - Instead, pass only the necessary primitive data types (strings, numbers, booleans) or small, focused data transfer objects (DTOs) required for the function's specific task.
- **Use Adapters/Glue Code:** If a function needs data derived from a complex object, create a dedicated piece of "glue code" (an adapter function, a method within a class, or a dedicated module) that extracts/transforms the required simple data *before* calling the core logic function. This decouples the core logic from the complex data structure's specific shape.
- **Benefits:** This approach leads to:
    - **Improved Testability:** Functions with simple inputs/outputs are significantly easier to unit test without complex setup or mocking.
    - **Reduced Coupling:** Core logic doesn't depend directly on the structure of large, potentially volatile objects or external systems (like Phaser). Changes in one area are less likely to break unrelated logic.
    - **Enhanced Reusability:** Functions become more self-contained and reusable in different contexts.
    - **Easier Reasoning:** Simpler inputs and outputs make the function's behavior easier to understand, predict, and maintain.

# State Management & Communication

*   **State Separation Principle:** CRITICAL - Keep high-frequency game state (e.g., entity positions, physics) strictly within Phaser scenes. Only sync lower-frequency summary data or necessary UI state to React/Zustand periodically (e.g., every 10-15 frames) to avoid performance bottlenecks caused by React re-renders. (Ref: PERFORMANCE_PLAN.MD, STATE_ARCHITECTURE.MD)
*   **Communication:** Utilize a central **Event Bus** for decoupled communication between React components and Phaser scenes. Use the **Adapter Pattern** to provide standardized interfaces for React to interact with specific game features within Phaser (e.g., `useCombatAdapter`, `useTerritoryAdapter`). (Ref: STATE_ARCHITECTURE.MD)
*   **Zustand Stores:** Prefer smaller, **domain-specific stores** (e.g., `ResourceStore`, `CombatStore`, `WorkshopStore`) over monolithic ones. (Ref: STATE_ARCHITECTURE.MD)

## State Management Guidelines (General)
- Keep state as close as possible to where it's used.
- Lift state up only when necessary.
- Use context for intermediate state sharing.
- Prefer composition over prop drilling.
- Document state shape and mutations.
- Consider using state machines for complex flows.

## Global State (Zustand)
- Persistent game data (inventory, progression, settings)
- Domain-specific stores (inventory, progression, settings)
- Clear boundaries between stores

## Local State
- Component UI state only
- Temporary visual feedback
- Form inputs

## Game State
- Active session data
- Temporary run statistics
- Scene-specific state in Phaser

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

1. **Direction**: Features depend on shared features, not on each other
2. **Adaptation**: Each feature adapts shared functionality to its specific needs
3. **Encapsulation**: Features interact with shared functionality only through adapters
4. **Independence**: Features should operate without knowledge of other features

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
- Profile early and often
- Keep Phaser game operations efficient
  - Use proper scene management
  - Implement object pooling for frequently created/destroyed game objects
  - Use sprite sheets and texture atlases
  - Implement proper physics group management
  - Consider using multiple scenes for different game areas