# {{PROJECT_NAME}}

A classic slot machine game built with Pixi.js, TypeScript, and Zustand for state management.

## Features

- 🎰 Classic 5-reel slot machine gameplay
- 🎨 Animated reels with symbol reveals
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
│   └── slot-machine/       # Slot machine game logic
│       ├── components/     # Slot machine UI components
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

## Game Mechanics

### Slot Machine Features

- **5 Reels x 3 Rows**: Classic slot machine layout
- **8 Different Symbols**: Cherry, Lemon, Orange, Grape, Bell, Bar, Seven, Diamond
- **Simple Win Calculation**: Match 3+ symbols in the middle row
- **Bet Management**: Adjustable bet amounts
- **Balance Tracking**: Real-time balance updates

### Symbols and Values

- 🍒 Cherry: Low value (5 coins)
- 🍋 Lemon: Low value (10 coins)
- 🍊 Orange: Medium value (15 coins)
- 🍇 Grape: Medium value (20 coins)
- 🔔 Bell: High value (50 coins)
- ▬ Bar: High value (100 coins)
- 7 Seven: Very high value (200 coins)
- 💎 Diamond: Highest value (500 coins)

## Configuration

### Game Settings

Modify game settings in `src/shared/constants/index.ts`:

- Reel count and symbol layout
- Bet limits and default values
- Symbol probabilities
- Animation durations

### Symbol Configuration

Update symbols and probabilities:

```typescript
export const SYMBOLS = [
  { id: 'cherry', name: 'Cherry', value: 5, color: 0xff4444 },
  // Add more symbols...
]

export const SYMBOL_PROBABILITIES = {
  cherry: 0.25,
  // Configure probabilities...
}
```

## Adding New Features

### Creating New Symbols

1. Add symbol to `SYMBOLS` array
2. Update `SYMBOL_PROBABILITIES`
3. Add display mapping in `SlotMachineComponent`

### Adding Paylines

1. Define paylines in `PAYLINES` array
2. Update win calculation logic
3. Add visual payline indicators

### Extending Game Logic

1. Add new mechanics in `src/features/slot-machine/`
2. Update state management in `src/shared/store/`
3. Create corresponding UI components

## Architecture

The game follows a modular architecture with:

- **Scene Management**: Smooth transitions between game states
- **Component System**: Reusable, self-contained game components
- **State Management**: Centralized game state with Zustand
- **Type Safety**: Full TypeScript coverage

## Performance

- Efficient PIXI.js rendering
- Proper cleanup of animations and resources
- Responsive design for different screen sizes
- Optimized asset loading

## Browser Support

- Modern browsers with WebGL support
- ES2020+ JavaScript features
- Touch and mouse input supported

## License

[Add your license information here]