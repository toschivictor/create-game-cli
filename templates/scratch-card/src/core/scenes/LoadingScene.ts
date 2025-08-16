import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'
import type { Scene, SceneData } from '@/shared/types'
import { GAME_CONFIG, COLORS, SCENES } from '@/shared/constants'
import { useGameStore } from '@/shared/store/gameStore'

export class LoadingScene extends Container implements Scene {
  name: string = SCENES.LOADING
  private progressBar: Graphics
  private progressBarBg: Graphics
  private loadingText: Text
  private progress: number = 0

  constructor() {
    super()
    
    this.progressBarBg = new Graphics()
    this.progressBar = new Graphics()
    this.loadingText = new Text({
      text: 'Loading...',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 24,
        fill: COLORS.WHITE,
        align: 'center',
      }),
    })
  }

  async init(): Promise<void> {
    // Set up loading text
    this.loadingText.anchor.set(0.5)
    this.loadingText.x = GAME_CONFIG.WIDTH / 2
    this.loadingText.y = GAME_CONFIG.HEIGHT / 2 - 50

    // Set up progress bar background
    this.progressBarBg.rect(0, 0, 300, 20)
    this.progressBarBg.fill(COLORS.GRAY)
    this.progressBarBg.x = GAME_CONFIG.WIDTH / 2 - 150
    this.progressBarBg.y = GAME_CONFIG.HEIGHT / 2

    // Set up progress bar
    this.progressBar.x = GAME_CONFIG.WIDTH / 2 - 150
    this.progressBar.y = GAME_CONFIG.HEIGHT / 2

    // Add to scene
    this.addChild(this.progressBarBg)
    this.addChild(this.progressBar)
    this.addChild(this.loadingText)

    // Start loading simulation
    this.startLoading()
  }

  async onEnter(): Promise<void> {
    useGameStore.getState().setLoading(true)
  }

  async onExit(): Promise<void> {
    useGameStore.getState().setLoading(false)
  }

  private startLoading(): void {
    // Simulate loading with tween
    gsap.to(this, {
      progress: 1,
      duration: 3,
      ease: 'power2.out',
      onUpdate: () => {
        this.updateProgressBar()
        this.updateLoadingText()
      },
      onComplete: () => {
        this.onLoadingComplete()
      },
    })

    // Add some pulsing animation to the loading text
    gsap.to(this.loadingText, {
      alpha: 0.5,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    })
  }

  private updateProgressBar(): void {
    const width = 300 * this.progress
    
    this.progressBar.clear()
    this.progressBar.rect(0, 0, width, 20)
    this.progressBar.fill(COLORS.PRIMARY)
  }

  private updateLoadingText(): void {
    const percentage = Math.floor(this.progress * 100)
    this.loadingText.text = `Loading... ${percentage}%`
  }

  private async onLoadingComplete(): Promise<void> {
    // Stop the pulsing animation
    gsap.killTweensOf(this.loadingText)
    this.loadingText.alpha = 1

    // Wait a moment before transitioning
    await new Promise(resolve => setTimeout(resolve, 500))

    // Navigate to menu scene
    // Note: This would typically be handled by the router or game manager
    // For now, we'll emit an event or call a callback
    this.onLoadingFinished()
  }

  private onLoadingFinished(): void {
    // This would typically trigger navigation to the menu scene
    // The actual navigation will be handled by the GameManager
    console.log('Loading complete, ready to navigate to menu')
    
    // Dispatch a custom event that the GameManager can listen to
    window.dispatchEvent(new CustomEvent('loadingComplete'))
  }

  update(deltaTime: number): void {
    // No continuous updates needed for loading scene
  }

  destroy(): void {
    gsap.killTweensOf(this)
    gsap.killTweensOf(this.loadingText)
    super.destroy()
  }
}