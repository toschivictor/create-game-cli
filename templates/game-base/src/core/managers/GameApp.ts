import { Application } from 'pixi.js'
import { SceneRouter } from '@/core/router/SceneRouter'
import type { GameDefinition } from '@/games/types'

export class GameApp {
  private app: Application
  private router: SceneRouter
  private container: HTMLElement
  private game: GameDefinition

  constructor(container: HTMLElement, game: GameDefinition) {
    this.container = container
    this.app = new Application()
    this.router = new SceneRouter(this.app)
    this.game = game
  }

  async initialize(): Promise<void> {
    await this.app.init({ width: 800, height: 600, backgroundColor: 0x1a1a2e, antialias: true })
    this.container.appendChild(this.app.canvas)

    this.setupResponsiveDesign()
    this.game.registerScenes(this.router)
    this.game.registerDomain?.()

    this.app.ticker.add((ticker) => this.router.update(ticker.deltaTime))
    await this.router.navigateTo(this.game.initialScene)

    const loadingElement = document.getElementById('loading')
    if (loadingElement) loadingElement.remove()
  }

  private setupResponsiveDesign(): void {
    const resize = () => {
      const container = this.container
      const canvas = this.app.canvas
      if (!container || !canvas) return
      const scaleX = container.clientWidth / 800
      const scaleY = container.clientHeight / 600
      const scale = Math.min(scaleX, scaleY)
      canvas.style.width = `${800 * scale}px`
      canvas.style.height = `${600 * scale}px`
    }
    resize()
    window.addEventListener('resize', resize)
  }

  destroy(): void {
    this.app.ticker.stop()
    this.router.destroy()
    this.app.destroy(true)
  }
}
