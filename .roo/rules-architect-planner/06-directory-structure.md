## Directory Organization Principles
- Features are the primary organizational unit.
- All files related to a feature should be in that feature's directory.
- Use descriptive file names with purpose-based suffixes.
- Create sub-feature directories only when a feature area becomes complex.
- Keep cross-cutting functionality in shared directories.

## Pattern
```
src/
  features/                     # All game features
    {feature-name}/             # Each specific game feature
      {Feature}.tsx             # Root React component for the feature
      {Feature}.scene.ts        # Phaser scene for the feature (if applicable)
      {Feature}.store.ts        # State management for the feature
      {domain-object}.ts        # Domain-specific logic files

      # Sub-features pattern (when needed)
      {sub-feature}/            # A distinct part of the feature
        {SubFeature}.tsx        # UI components
        {SubFeature}.store.ts   # State management for sub-feature

    shared/                     # Cross-cutting concerns
      types.ts                  # Shared type definitions
      utils.ts                  # Shared utility functions
      ui/                       # Reusable UI components
        {Component}.tsx         # Generic UI components

  app/                          # Next.js pages (Assuming this is the project root structure, adjust if needed)
```

## Current Implementation Examples (Illustrative)
```
src/
  features/
    combat/
      Combat.tsx                # Combat UI root component
      Combat.scene.ts           # Combat game scene
      Combat.store.ts           # Combat state management
      Player.ts                 # Player entity logic
      Enemy.ts                  # Enemy entity logic

    gathering/
      Gathering.tsx             # Gathering UI root component
      Gathering.scene.ts        # Gathering game scene
      Resource.store.ts         # Resource management
      ResourceNode.ts           # Resource node logic

    shared/
      types.ts                  # Shared type definitions
      utils.ts                  # Utility functions
      ui/
        Button.tsx              # Reusable button component
        Panel.tsx               # Reusable panel component

  app/
    page.tsx                    # Next.js app entry point (Adjust if not Next.js)
```