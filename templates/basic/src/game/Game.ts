import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js'
import { GameScene } from './scenes/GameScene'

export class Game {
  private app: Application
  private currentScene: Container | null = null
  private gameScene: GameScene

  constructor(private container: HTMLElement) {
    // Create the PIXI application
    this.app = new Application()
    this.gameScene = new GameScene()
  }

  async start(): Promise<void> {
    // Initialize the application
    await this.app.init({
      width: 800,
      height: 600,
      backgroundColor: 0x1a1a1a,
      antialias: true,
    })

    // Add the application canvas to the container
    this.container.appendChild(this.app.canvas)

    // Set up resize handling
    window.addEventListener('resize', this.handleResize.bind(this))

    // Load initial scene
    this.loadScene(this.gameScene)

    // Start the game loop
    this.app.ticker.add(this.update.bind(this))
  }

  private loadScene(scene: Container): void {
    // Remove current scene if exists
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene)
    }

    // Add new scene
    this.currentScene = scene
    this.app.stage.addChild(scene)

    // Initialize scene if it has an init method
    if ('init' in scene && typeof scene.init === 'function') {
      scene.init()
    }
  }

  private update(deltaTime: number): void {
    // Update current scene
    if (this.currentScene && 'update' in this.currentScene && typeof this.currentScene.update === 'function') {
      this.currentScene.update(deltaTime)
    }
  }

  private handleResize(): void {
    // Handle window resize if needed
    // You can implement responsive behavior here
  }
}