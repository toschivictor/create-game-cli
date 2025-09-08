import type { Application } from 'pixi.js'
import { gsap } from 'gsap'
import type { BaseScene } from '@/core/scenes/BaseScene'

export type SceneName = string

export class SceneRouter {
  private app: Application
  private scenes = new Map<SceneName, BaseScene>()
  private currentScene: BaseScene | null = null
  private isTransitioning = false

  constructor(app: Application) {
    this.app = app
  }

  registerScene(name: SceneName, scene: BaseScene): void {
    scene.name = name
    this.scenes.set(name, scene)
  }

  async navigateTo(name: SceneName, data?: unknown): Promise<void> {
    if (this.isTransitioning) return
    const target = this.scenes.get(name)
    if (!target) return
    this.isTransitioning = true
    try {
      if (this.currentScene?.onExit) await this.currentScene.onExit()
      if (this.currentScene) {
        await new Promise<void>((resolve) => {
          gsap.to(this.currentScene!, {
            alpha: 0,
            scale: 0.95,
            duration: 0.4,
            onComplete: () => {
              this.app.stage.removeChild(this.currentScene!)
              resolve()
            },
          })
        })
      }

      target.alpha = 0
      target.scale.set(1.05)
      this.app.stage.addChild(target)
      this.currentScene = target

      await target.init?.(data)
      await target.onEnter?.(data)

      await new Promise<void>((resolve) => {
        gsap.to(target, { alpha: 1, scale: 1, duration: 0.4, onComplete: resolve })
      })
    } finally {
      this.isTransitioning = false
    }
  }

  update(delta: number): void {
    this.currentScene?.update?.(delta)
  }

  destroy(): void {
    for (const scene of this.scenes.values()) {
      scene.destroy()
      scene.removeFromParent()
    }
    this.scenes.clear()
    this.currentScene = null
  }
}
