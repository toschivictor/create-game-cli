# Game Base Template

A minimal, game-agnostic PIXI template with clean architecture:

- core: engine/runtime (GameApp, SceneRouter, BaseScene, EventBus)
- domain: business logic (Zustand slices, services)
- games: pluggable game modules (scratch-card example)
- infrastructure: adapters for third-party events
- ui: reusable components
- shared: constants, types, utils

## Develop

```
npm install
npm run dev
```

## Swap Games

Implement a new game under `src/games/<your-game>` that provides a `GameDefinition`, and change `src/main.ts` to boot it.
