# {{PROJECT_NAME}}

A modern game built with React, Pixi.js, and Zustand for state management, demonstrating best practices for integrating Pixi.js with React.

## Features

- 🎮 React + Pixi.js integration using @pixi/react
- ⚡ Real-time game loop with collision detection
- 🎯 Custom React hooks for game logic
- 🔧 State management with Zustand
- 🎨 Responsive UI overlay with React
- 📱 Keyboard input handling
- 🎮 Simple shoot-em-up gameplay
- 🎯 TypeScript for type safety

## Project Structure

```
src/
├── components/             # React components
│   ├── GameContainer.tsx   # Main Pixi.js Stage wrapper
│   ├── MenuScene.tsx       # Menu scene component
│   ├── GameScene.tsx       # Main game scene
│   ├── GameOverScene.tsx   # Game over scene
│   └── UI.tsx              # React UI overlay
├── hooks/                  # Custom React hooks
│   ├── useGameLoop.ts      # Game loop and physics
│   └── useKeyboard.ts      # Keyboard input handling
├── store/                  # State management
│   └── gameStore.ts        # Zustand store
├── types/                  # TypeScript definitions
│   └── index.ts            # Game types
└── utils/                  # Utility functions
```

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Check code quality
npm run check
```

## Architecture

### React + Pixi.js Integration

This template demonstrates the best practices for combining React and Pixi.js:

- **@pixi/react**: Official React renderer for Pixi.js
- **Separation of Concerns**: React for UI, Pixi.js for graphics
- **State Management**: Zustand for global game state
- **Custom Hooks**: Encapsulated game logic in reusable hooks

### Key Components

#### GameContainer
The main component that renders the Pixi.js Stage and manages scene transitions.

#### Custom Hooks
- **useGameLoop**: Handles game physics, collision detection, and entity updates
- **useKeyboard**: Manages keyboard input for player movement and actions

#### Scene Components
Each scene is a React component that renders Pixi.js graphics:
- Declarative syntax for Pixi.js objects
- Automatic cleanup and lifecycle management
- Easy composition and reusability

### State Management

Uses Zustand for predictable state management:
- Game state (score, lives, level)
- Entity management (player, enemies, bullets)
- Scene transitions
- Game flow (start, pause, restart)

## Game Controls

- **WASD** or **Arrow Keys**: Move player
- **Space**: Shoot bullets
- **React UI**: Start game, pause/resume, restart

## Extending the Game

### Adding New Scenes

1. Create a new React component in `src/components/`
2. Add scene type to `SceneName` type in `src/types/`
3. Update `GameContainer` to render the new scene
4. Add scene logic to Zustand store

### Adding New Entities

1. Define entity interface in `src/types/`
2. Add entity state to Zustand store
3. Create React component for rendering
4. Add entity logic to `useGameLoop` hook

### Custom Game Logic

1. Create custom hooks in `src/hooks/`
2. Use Zustand for state management
3. Integrate with existing game loop
4. Add React UI as needed

## Best Practices Demonstrated

- **Component Composition**: Breaking down complex scenes into smaller components
- **Custom Hooks**: Extracting game logic into reusable hooks
- **Type Safety**: Full TypeScript coverage for game entities and state
- **Performance**: Efficient React re-rendering with proper state management
- **Separation**: Clear boundaries between React UI and Pixi.js graphics

## Performance Considerations

- Pixi.js handles graphics rendering
- React manages UI and game state
- Custom hooks optimize game loop performance
- Zustand provides efficient state updates

## Browser Support

- Modern browsers with WebGL support
- ES2020+ JavaScript features
- React 18+ features

## License

[Add your license information here]