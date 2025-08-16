import type { Application } from 'pixi.js'
import { gsap } from 'gsap'
import type { Scene, SceneData, SceneName, RouteChangeEvent } from '@/shared/types'
import { ANIMATIONS } from '@/shared/constants'
import { useGameStore } from '@/shared/store/gameStore'

export class SceneRouter {
  private app: Application
  private scenes: Map<SceneName, Scene> = new Map()
  private currentScene: Scene | null = null
  private isTransitioning = false

  constructor(app: Application) {
    this.app = app
  }

  /**
   * Register a scene with the router
   */
  registerScene(name: SceneName, scene: Scene): void {
    scene.name = name
    this.scenes.set(name, scene)
  }

  /**
   * Navigate to a specific scene
   */
  async navigateTo(sceneName: SceneName, data?: SceneData): Promise<void> {
    if (this.isTransitioning) {
      console.warn(`Scene transition already in progress, ignoring navigation to ${sceneName}`)
      return
    }

    const targetScene = this.scenes.get(sceneName)
    if (!targetScene) {
      console.error(`Scene '${sceneName}' not found`)
      return
    }

    this.isTransitioning = true

    try {
      const routeEvent: RouteChangeEvent = {
        from: this.currentScene?.name as SceneName || null,
        to: sceneName,
        data,
      }

      // Trigger route change event
      this.onRouteChange(routeEvent)

      // Exit current scene
      if (this.currentScene) {
        await this.exitScene(this.currentScene)
      }

      // Enter new scene
      await this.enterScene(targetScene, data)

      // Update store
      useGameStore.getState().setCurrentScene(sceneName)
    } catch (error) {
      console.error('Error during scene transition:', error)
    } finally {
      this.isTransitioning = false
    }
  }

  /**
   * Get the current scene
   */
  getCurrentScene(): Scene | null {
    return this.currentScene
  }

  /**
   * Update the current scene
   */
  update(deltaTime: number): void {
    if (this.currentScene?.update) {
      this.currentScene.update(deltaTime)
    }
  }

  private async exitScene(scene: Scene): Promise<void> {
    // Call scene's onExit hook
    if (scene.onExit) {
      await scene.onExit()
    }

    // Animate scene exit
    await new Promise<void>((resolve) => {
      gsap.to(scene, {
        alpha: 0,
        scale: 0.9,
        duration: ANIMATIONS.SCENE_TRANSITION_DURATION,
        ease: 'power2.inOut',
        onComplete: () => {
          this.app.stage.removeChild(scene)
          resolve()
        },
      })
    })
  }

  private async enterScene(scene: Scene, data?: SceneData): Promise<void> {
    // Set initial properties for animation
    scene.alpha = 0
    scene.scale.set(1.1)

    // Add to stage
    this.app.stage.addChild(scene)
    this.currentScene = scene

    // Initialize scene
    await scene.init(data)

    // Call scene's onEnter hook
    if (scene.onEnter) {
      await scene.onEnter(data)
    }

    // Animate scene entrance
    await new Promise<void>((resolve) => {
      gsap.to(scene, {
        alpha: 1,
        scale: 1,
        duration: ANIMATIONS.SCENE_TRANSITION_DURATION,
        ease: 'power2.inOut',
        onComplete: resolve,
      })
    })
  }

  private onRouteChange(event: RouteChangeEvent): void {
    console.log(`Navigating from ${event.from || 'none'} to ${event.to}`)
    
    // You can add global route change logic here
    // For example, analytics, logging, or global state updates
  }

  /**
   * Destroy all scenes and clean up
   */
  destroy(): void {
    for (const scene of this.scenes.values()) {
      if (scene.destroy) {
        scene.destroy()
      }
      scene.removeFromParent()
    }
    this.scenes.clear()
    this.currentScene = null
  }
}