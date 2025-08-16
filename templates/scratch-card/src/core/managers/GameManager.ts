import { Application } from 'pixi.js'
import { SceneRouter } from '@/core/router/SceneRouter'
import { LoadingScene } from '@/core/scenes/LoadingScene'
import { MenuScene } from '@/core/scenes/MenuScene'
import { GameScene } from '@/core/scenes/GameScene'
import { ResultScene } from '@/core/scenes/ResultScene'
import { GAME_CONFIG, SCENES } from '@/shared/constants'
import { useGameStore } from '@/shared/store/gameStore'

export class GameManager {
  private app: Application
  private router: SceneRouter
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
    this.app = new Application()
    this.router = new SceneRouter(this.app)
  }

  async initialize(): Promise<void> {
    try {
      // Initialize PIXI Application
      await this.app.init({
        width: GAME_CONFIG.WIDTH,
        height: GAME_CONFIG.HEIGHT,
        backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
        antialias: GAME_CONFIG.ANTIALIAS,
      })

      // Add canvas to container
      this.container.appendChild(this.app.canvas)

      // Set up responsive design
      this.setupResponsiveDesign()

      // Register all scenes
      this.registerScenes()

      // Set up game loop
      this.setupGameLoop()

      // Start with loading scene
      await this.router.navigateTo(SCENES.LOADING)

      // Remove loading indicator
      const loadingElement = document.getElementById('loading')
      if (loadingElement) {
        loadingElement.remove()
      }

      console.log('Game initialized successfully')
    } catch (error) {
      console.error('Failed to initialize game:', error)
      throw error
    }
  }

  private registerScenes(): void {
    // Create and register all scenes
    this.router.registerScene(SCENES.LOADING, new LoadingScene())
    this.router.registerScene(SCENES.MENU, new MenuScene(this.router))
    this.router.registerScene(SCENES.GAME, new GameScene(this.router))
    this.router.registerScene(SCENES.RESULT, new ResultScene(this.router))
  }

  private setupGameLoop(): void {
    this.app.ticker.add((ticker) => {
      const deltaTime = ticker.deltaTime
      
      // Update current scene
      this.router.update(deltaTime)
      
      // You can add other global updates here
      // For example, audio manager, particle systems, etc.
    })
  }

  private setupResponsiveDesign(): void {
    const resize = () => {
      const container = this.container
      const canvas = this.app.canvas
      
      if (!container || !canvas) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      
      const scaleX = containerWidth / GAME_CONFIG.WIDTH
      const scaleY = containerHeight / GAME_CONFIG.HEIGHT
      const scale = Math.min(scaleX, scaleY)
      
      canvas.style.width = `${GAME_CONFIG.WIDTH * scale}px`
      canvas.style.height = `${GAME_CONFIG.HEIGHT * scale}px`
    }

    // Initial resize
    resize()

    // Listen for window resize
    window.addEventListener('resize', resize)
  }

  /**
   * Navigate to a specific scene
   */
  async navigateToScene(sceneName: string, data?: unknown): Promise<void> {
    await this.router.navigateTo(sceneName as any, data)
  }

  /**
   * Get the PIXI application instance
   */
  getApp(): Application {
    return this.app
  }

  /**
   * Get the scene router
   */
  getRouter(): SceneRouter {
    return this.router
  }

  /**
   * Destroy the game and clean up resources
   */
  destroy(): void {
    this.app.ticker.stop()
    this.router.destroy()
    this.app.destroy(true)
    
    // Clean up event listeners
    window.removeEventListener('resize', this.setupResponsiveDesign)
  }
}