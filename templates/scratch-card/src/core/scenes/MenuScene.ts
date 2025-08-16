import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'
import type { Scene, SceneData } from '@/shared/types'
import type { SceneRouter } from '@/core/router/SceneRouter'
import { GAME_CONFIG, COLORS, SCENES, SCRATCH_CARD_CONFIG } from '@/shared/constants'
import { useGameStore } from '@/shared/store/gameStore'
import { formatCurrency } from '@/shared/utils'
import { Button } from '@/ui/components/Button'

export class MenuScene extends Container implements Scene {
  name: string = SCENES.MENU
  private router: SceneRouter
  private titleText: Text
  private balanceText: Text
  private playButton: Button
  private statsContainer: Container
  private backgroundGraphics: Graphics
  
  private unsubscribe?: () => void

  constructor(router: SceneRouter) {
    super()
    this.router = router
    
    this.backgroundGraphics = new Graphics()
    this.titleText = new Text({
      text: 'Scratch Card Game',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 48,
        fill: COLORS.WHITE,
        align: 'center',
        fontWeight: 'bold',
      }),
    })
    
    this.balanceText = new Text({
      text: '',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 24,
        fill: COLORS.SECONDARY,
        align: 'center',
      }),
    })

    this.playButton = new Button({
      text: `Play (${formatCurrency(SCRATCH_CARD_CONFIG.CARD_COST)})`,
      width: 200,
      height: 60,
      style: {
        backgroundColor: COLORS.PRIMARY,
        textColor: COLORS.WHITE,
        fontSize: 20,
      },
      onClick: () => this.startGame(),
    })

    this.statsContainer = new Container()
  }

  async init(): Promise<void> {
    // Set up background
    this.createBackground()
    
    // Set up title
    this.titleText.anchor.set(0.5)
    this.titleText.x = GAME_CONFIG.WIDTH / 2
    this.titleText.y = 120

    // Set up balance display
    this.balanceText.anchor.set(0.5)
    this.balanceText.x = GAME_CONFIG.WIDTH / 2
    this.balanceText.y = 200

    // Set up play button
    this.playButton.x = GAME_CONFIG.WIDTH / 2 - this.playButton.width / 2
    this.playButton.y = 280

    // Set up stats
    this.createStatsDisplay()

    // Add all elements
    this.addChild(this.backgroundGraphics)
    this.addChild(this.titleText)
    this.addChild(this.balanceText)
    this.addChild(this.playButton)
    this.addChild(this.statsContainer)

    // Subscribe to store changes
    this.subscribeToStore()
    
    // Update display
    this.updateDisplay()
  }

  async onEnter(): Promise<void> {
    // Animate entrance
    this.titleText.y -= 20
    this.titleText.alpha = 0
    this.balanceText.alpha = 0
    this.playButton.alpha = 0
    this.statsContainer.alpha = 0

    gsap.to(this.titleText, {
      y: 120,
      alpha: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
    })

    gsap.to(this.balanceText, {
      alpha: 1,
      duration: 0.6,
      delay: 0.2,
    })

    gsap.to(this.playButton, {
      alpha: 1,
      duration: 0.6,
      delay: 0.4,
    })

    gsap.to(this.statsContainer, {
      alpha: 1,
      duration: 0.6,
      delay: 0.6,
    })
  }

  async onExit(): Promise<void> {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  private createBackground(): void {
    this.backgroundGraphics.clear()
    
    // Create gradient background
    this.backgroundGraphics.rect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT)
    this.backgroundGraphics.fill(GAME_CONFIG.BACKGROUND_COLOR)
    
    // Add some decorative elements
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * GAME_CONFIG.WIDTH
      const y = Math.random() * GAME_CONFIG.HEIGHT
      const radius = Math.random() * 3 + 1
      
      this.backgroundGraphics.circle(x, y, radius)
      this.backgroundGraphics.fill(COLORS.WHITE, 0.1)
    }
  }

  private createStatsDisplay(): void {
    const store = useGameStore.getState()
    
    const statsTitle = new Text({
      text: 'Statistics',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 20,
        fill: COLORS.WHITE,
        align: 'center',
        fontWeight: 'bold',
      }),
    })
    
    const gamesPlayedText = new Text({
      text: `Games Played: ${store.gameHistory.length}`,
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        fill: COLORS.GRAY,
        align: 'center',
      }),
    })
    
    const winRateText = new Text({
      text: `Win Rate: ${store.getWinRate().toFixed(1)}%`,
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        fill: COLORS.GRAY,
        align: 'center',
      }),
    })
    
    const totalWinningsText = new Text({
      text: `Total Winnings: ${formatCurrency(store.getTotalWinnings())}`,
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        fill: COLORS.GRAY,
        align: 'center',
      }),
    })

    // Position stats
    statsTitle.anchor.set(0.5)
    gamesPlayedText.anchor.set(0.5)
    winRateText.anchor.set(0.5)
    totalWinningsText.anchor.set(0.5)
    
    statsTitle.x = GAME_CONFIG.WIDTH / 2
    statsTitle.y = 400
    
    gamesPlayedText.x = GAME_CONFIG.WIDTH / 2
    gamesPlayedText.y = 440
    
    winRateText.x = GAME_CONFIG.WIDTH / 2
    winRateText.y = 470
    
    totalWinningsText.x = GAME_CONFIG.WIDTH / 2
    totalWinningsText.y = 500

    this.statsContainer.addChild(statsTitle)
    this.statsContainer.addChild(gamesPlayedText)
    this.statsContainer.addChild(winRateText)
    this.statsContainer.addChild(totalWinningsText)
  }

  private subscribeToStore(): void {
    this.unsubscribe = useGameStore.subscribe(
      (state) => state.balance,
      () => this.updateDisplay()
    )
  }

  private updateDisplay(): void {
    const store = useGameStore.getState()
    this.balanceText.text = `Balance: ${formatCurrency(store.balance)}`
    
    // Update button state
    this.playButton.setEnabled(store.canAffordCard())
  }

  private async startGame(): Promise<void> {
    const store = useGameStore.getState()
    
    if (!store.canAffordCard()) {
      console.log('Insufficient balance')
      return
    }

    await this.router.navigateTo(SCENES.GAME)
  }

  update(deltaTime: number): void {
    // Add some floating animation to decorative elements
    this.backgroundGraphics.rotation += 0.001 * deltaTime
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    this.playButton.destroy()
    gsap.killTweensOf(this.titleText)
    gsap.killTweensOf(this.balanceText)
    gsap.killTweensOf(this.playButton)
    gsap.killTweensOf(this.statsContainer)
    super.destroy()
  }
}