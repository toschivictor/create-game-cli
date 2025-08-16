# Create Game CLI

A command-line tool to quickly scaffold Pixi.js game projects with TypeScript, Vite, and modern development tools.

## Features

- 🎮 **Multiple Templates**: Choose from Basic, Platformer, or Top-Down game templates
- 🔧 **TypeScript Support**: Full TypeScript configuration with strict mode
- ⚡ **Vite Integration**: Fast development server and optimized builds
- 🎨 **Code Quality**: Pre-configured with Biome for linting and formatting
- 📦 **Modern Tooling**: Uses latest versions of Pixi.js and development tools
- 🚀 **Ready to Run**: Generated projects work immediately with `npm run dev`

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

### Basic Game
- Simple game setup with a moveable green square
- Basic input handling (WASD/Arrow keys)
- Good starting point for any type of game

### Platformer
- Physics-based movement with gravity and jumping
- Platform collision detection
- Blue character that can jump on platforms
- Controls: A/D for movement, W/Up/Space for jumping

### Top-Down
- 8-directional movement with smooth rotation
- Obstacle collision detection
- Red triangle character that rotates to face movement direction
- Controls: WASD/Arrow keys for movement

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

## Technologies Used

### CLI Tool
- **Node.js**: Runtime environment
- **TypeScript**: Type safety and modern JavaScript features
- **@clack/prompts**: Beautiful interactive CLI prompts
- **fs-extra**: Enhanced file system operations
- **tsup**: Fast TypeScript bundler
- **Biome**: Code formatting and linting

### Generated Projects
- **Pixi.js**: High-performance 2D rendering engine
- **TypeScript**: Type safety for game development
- **Vite**: Fast development server and build tool
- **Biome**: Consistent code style and quality

## Requirements

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and ensure code quality: `npm run check`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## Roadmap

- [ ] Additional game templates (RPG, Racing, Puzzle)
- [ ] Asset generation and management
- [ ] Integration with popular game libraries
- [ ] Mobile-first responsive templates
- [ ] WebGL/WebGPU renderer options
- [ ] Audio integration examples
- [ ] Multiplayer template with WebSockets

---

Made with ❤️ for game developers