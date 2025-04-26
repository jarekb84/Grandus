## Directory Organization Principles
- Organize primarily by **feature**.
- Place all feature-related files within the feature's directory.
- Use descriptive file names with suffixes (e.g., `.store.ts`, `.scene.ts`).
- Create sub-feature directories for complexity.
- Use `shared/` for cross-cutting concerns (types, utils, generic UI).

## Pattern
```
src/
  features/                     # All game features
    {feature-name}/             # Specific game feature
      {Feature}.tsx             # Feature Root UI Component
      {Feature}.scene.ts        # Feature Phaser Scene (if applicable)
      {Feature}.store.ts        # Feature State (Zustand)
      {domain-object}.ts        # Feature Domain Logic

      # Optional Sub-feature structure
      {sub-feature}/            # Distinct sub-part
        {SubFeature}.tsx        # Sub-feature UI
        {SubFeature}.store.ts   # Sub-feature State

    shared/                     # Cross-cutting concerns
      types.ts                  # Shared Types
      utils.ts                  # Shared Utilities
      ui/                       # Reusable Generic UI
        {Component}.tsx

  app/                          # Root application structure
```

## Current Implementation Examples (Illustrative)
```
src/
  features/
    combat/
      Combat.tsx                # Combat UI Root
      Combat.scene.ts           # Combat Phaser Scene
      Combat.store.ts           # Combat State
      Player.ts                 # Player Logic
      Enemy.ts                  # Enemy Logic

    gathering/
      Gathering.tsx             # Gathering UI Root
      Gathering.scene.ts        # Gathering Phaser Scene
      Resource.store.ts         # Resource State
      ResourceNode.ts           # Node Logic

    shared/
      types.ts                  # Shared Types
      utils.ts                  # Utilities
      ui/
        Button.tsx              # Reusable Button
        Panel.tsx               # Reusable Panel

  app/
    page.tsx                    # App Entry Point
```