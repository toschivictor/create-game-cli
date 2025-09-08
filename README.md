# Create Game CLI

A command-line tool to quickly scaffold Pixi.js game projects with TypeScript, Vite, and modern development tools.

## Features

- **Multiple Templates**: Choose from Basic, Platformer, or Top-Down game templates
- **TypeScript Support**: Full TypeScript configuration with strict mode
- **Vite Integration**: Fast development server and optimized builds
- **Code Quality**: Pre-configured with Biome for linting and formatting
- **Modern Tooling**: Uses latest versions of Pixi.js and development tools
- **Ready to Run**: Generated projects work immediately with `npm run dev`

## Installation

### Global Installation (Recommended)

```bash
npm install -g create-game-cli
```

### Local Development

```bash
git clone <repository-url>
cd create-game-cli
npm install
npm run build
npm link
```

## Usage

### Interactive Mode

Simply run the command and follow the prompts:

```bash
create-game
```

The CLI will ask you for:
- Project name
- Template type (Basic, Platformer, or Top-Down)
- Target directory
- Whether to initialize git repository
- Whether to install dependencies

### Example

```bash
$ create-game
🎮 Create Game CLI

✔ What is your project name? … my-awesome-game
✔ Choose a project template: › Basic Game
✔ Where should we create your project? … ./my-awesome-game
✔ Initialize git repository? … yes
✔ Install dependencies? … yes

🎉 Your game project is ready!

Next steps:
  cd my-awesome-game
  npm run dev

Happy coding! 🚀
```

## Templates

### Pixi React
- React-based game development with Pixi.js
- Component-based architecture for game objects
- Scene management with multiple game states
- Includes: Menu, Game, and Game Over scenes
- Custom hooks for game loop and keyboard input
- State management with game store
- Perfect for interactive web games

### Scratch Card
- Scratch card game template with reveal mechanics
- Scene-based architecture with loading, menu, game, and result scenes
- Game manager for state coordination
- Modular component system
- Built-in UI components (buttons, etc.)
- Ideal for lottery, promotional, or reward games

## Generated Project Structure

```
your-game/
├── src/
│   ├── main.ts              # Entry point
│   ├── game/
│   │   ├── Game.ts          # Main game class
│   │   ├── scenes/
│   │   │   └── GameScene.ts # Game scene management
│   │   └── objects/
│   │       └── Player.ts    # Player character
│   └── utils/
│       └── InputManager.ts  # Input handling utilities
├── public/
│   └── favicon.svg         # Game favicon
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite bundler configuration
├── biome.json              # Code formatting and linting
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## Development Commands

After creating a project, you can use these commands:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code
npm run format

# Lint code
npm run lint

# Check and fix code quality issues
npm run check
```

## Generated Projects
- **Pixi.js**: High-performance 2D rendering engine
- **TypeScript**: Type safety for game development
- **Vite**: Fast development server and build tool
- **Biome**: Consistent code style and quality

## Roadmap

- [ ] Additional game templates (RPG, Racing, Puzzle)
- [ ] Asset generation and management
- [ ] Integration with popular game libraries
- [ ] Mobile-first responsive templates
- [ ] WebGL/WebGPU renderer options
- [ ] Audio integration examples
- [ ] Multiplayer template with WebSockets

---
