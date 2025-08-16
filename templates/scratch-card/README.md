# {{PROJECT_NAME}}

A modern scratch card game built with Pixi.js, TypeScript, and Zustand for state management.

## Features

- 🎮 Interactive scratch card gameplay
- 🎨 Modern UI with smooth animations
- 🔧 State management with Zustand
- 🚀 Scene routing system
- 📱 Responsive design
- 🎯 TypeScript for type safety
- ⚡ Built with Vite for fast development

## Project Structure

```
src/
├── core/                    # Core game systems
│   ├── managers/           # Game manager and orchestration
│   ├── router/             # Scene routing system
│   └── scenes/             # Game scenes (Loading, Menu, Game, Result)
├── features/               # Feature-specific components
│   └── scratch-card/       # Scratch card game logic
│       ├── components/     # Scratch card UI components
│       ├── logic/          # Game logic and mechanics
│       └── assets/         # Feature-specific assets
├── shared/                 # Shared utilities and types
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── constants/         # Game constants and configuration
├── ui/                    # Reusable UI components
│   ├── components/        # Button, Modal, etc.
│   └── layouts/           # Layout components
└── assets/                # Global game assets
    ├── images/
    ├── sounds/
    └── fonts/
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

## Game Architecture

### Scene Management

The game uses a scene-based architecture with smooth transitions:

- **LoadingScene**: Shows loading progress and initializes resources
- **MenuScene**: Main menu with balance display and statistics
- **GameScene**: Interactive scratch card gameplay
- **ResultScene**: Shows game results and options to continue

### State Management

Global game state is managed using Zustand with the following key features:

- Player balance and transaction history
- Current game state and scene management
- Scratch card data and progress
- Game statistics and analytics

### Component System

Reusable components follow a consistent pattern:

- **Scene Components**: Implement the `Scene` interface with lifecycle methods
- **UI Components**: Self-contained interactive elements (Button, etc.)
- **Feature Components**: Game-specific logic (ScratchCardComponent)

## Configuration

### Game Settings

Modify game settings in `src/shared/constants/index.ts`:

- Card cost and prize probabilities
- Animation durations and easing
- UI colors and styling
- Screen dimensions

### Prize Configuration

Update prize probabilities and values:

```typescript
export const PRIZES = [
  { value: 0, probability: 0.6, label: 'Try Again' },
  { value: 5, probability: 0.2, label: '$5' },
  // Add more prizes...
]
```

## Adding New Features

### Creating a New Scene

1. Create scene class implementing the `Scene` interface
2. Register in `GameManager.registerScenes()`
3. Add scene transition logic

### Adding UI Components

1. Create component in `src/ui/components/`
2. Follow the established pattern for interactions and styling
3. Add proper TypeScript types

### Extending Game Logic

1. Add new game mechanics in `src/features/`
2. Update state management in `src/shared/store/`
3. Create corresponding UI components

## Performance Considerations

- Textures are efficiently managed and destroyed
- GSAP animations are properly cleaned up
- Scene transitions are optimized for smooth performance
- Responsive design adapts to different screen sizes

## Browser Support

- Modern browsers with WebGL support
- ES2020+ JavaScript features
- Touch and mouse input supported

## Contributing

1. Follow the established code style
2. Add TypeScript types for new features
3. Include proper error handling
4. Test on multiple devices and browsers

## License

[Add your license information here]