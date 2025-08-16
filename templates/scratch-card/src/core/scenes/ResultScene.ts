import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'
import type { Scene, SceneData } from '@/shared/types'
import type { SceneRouter } from '@/core/router/SceneRouter'
import { GAME_CONFIG, COLORS, SCENES } from '@/shared/constants'
import { useGameStore } from '@/shared/store/gameStore'
import { formatCurrency } from '@/shared/utils'
import { Button } from '@/ui/components/Button'

export class ResultScene extends Container implements Scene {
  name: string = SCENES.RESULT
  private router: SceneRouter
  private backgroundGraphics: Graphics
  private resultText: Text
  private prizeText: Text
  private balanceText: Text
  private playAgainButton: Button
  private menuButton: Button
  private statsContainer: Container
  
  private prizeValue: number = 0
  private prizeLabel: string = ''

  constructor(router: SceneRouter) {
    super()
    this.router = router
    
    this.backgroundGraphics = new Graphics()
    
    this.resultText = new Text({
      text: '',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 36,
        fill: COLORS.WHITE,
        align: 'center',
        fontWeight: 'bold',
      }),
    })

    this.prizeText = new Text({
      text: '',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 48,
        fill: COLORS.SECONDARY,
        align: 'center',
        fontWeight: 'bold',
      }),
    })

    this.balanceText = new Text({
      text: '',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 20,
        fill: COLORS.WHITE,
        align: 'center',
      }),
    })

    this.playAgainButton = new Button({
      text: 'Play Again',
      width: 160,
      height: 50,
      style: {
        backgroundColor: COLORS.PRIMARY,
        textColor: COLORS.WHITE,
        fontSize: 18,
      },
      onClick: () => this.playAgain(),
    })

    this.menuButton = new Button({
      text: 'Back to Menu',
      width: 160,
      height: 50,
      style: {
        backgroundColor: COLORS.GRAY,
        textColor: COLORS.WHITE,
        fontSize: 18,
      },
      onClick: () => this.goToMenu(),
    })

    this.statsContainer = new Container()
  }

  async init(data?: SceneData): Promise<void> {
    // Extract data from route
    if (data) {
      this.prizeValue = (data.prizeValue as number) || 0
      this.prizeLabel = (data.prizeLabel as string) || ''
    }

    // Set up background
    this.createBackground()

    // Set up result text
    this.resultText.text = this.prizeValue > 0 ? 'Congratulations!' : 'Better Luck Next Time'
    this.resultText.anchor.set(0.5)
    this.resultText.x = GAME_CONFIG.WIDTH / 2
    this.resultText.y = 120

    // Set up prize text
    this.prizeText.text = this.prizeLabel
    this.prizeText.style.fill = this.prizeValue > 0 ? COLORS.SECONDARY : COLORS.DANGER
    this.prizeText.anchor.set(0.5)
    this.prizeText.x = GAME_CONFIG.WIDTH / 2
    this.prizeText.y = 200

    // Set up balance text
    this.updateBalanceText()
    this.balanceText.anchor.set(0.5)
    this.balanceText.x = GAME_CONFIG.WIDTH / 2
    this.balanceText.y = 280

    // Set up buttons
    this.playAgainButton.x = GAME_CONFIG.WIDTH / 2 - 170
    this.playAgainButton.y = 350

    this.menuButton.x = GAME_CONFIG.WIDTH / 2 + 10
    this.menuButton.y = 350

    // Set up stats
    this.createStatsDisplay()

    // Add all elements
    this.addChild(this.backgroundGraphics)
    this.addChild(this.resultText)
    this.addChild(this.prizeText)
    this.addChild(this.balanceText)
    this.addChild(this.playAgainButton)
    this.addChild(this.menuButton)
    this.addChild(this.statsContainer)

    // Update button states
    this.updateButtonStates()
  }

  async onEnter(): Promise<void> {
    // Set initial positions for animation
    this.resultText.y -= 30
    this.resultText.alpha = 0
    this.prizeText.scale.set(0)
    this.balanceText.alpha = 0
    this.playAgainButton.alpha = 0
    this.menuButton.alpha = 0
    this.statsContainer.alpha = 0

    // Animate elements in sequence
    gsap.to(this.resultText, {
      y: 120,
      alpha: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
    })

    gsap.to(this.prizeText.scale, {
      x: 1,
      y: 1,
      duration: 0.6,
      delay: 0.3,
      ease: 'back.out(2)',
    })

    gsap.to(this.balanceText, {
      alpha: 1,
      duration: 0.5,
      delay: 0.6,
    })

    gsap.to(this.playAgainButton, {
      alpha: 1,
      duration: 0.5,
      delay: 0.8,
    })

    gsap.to(this.menuButton, {
      alpha: 1,
      duration: 0.5,
      delay: 0.9,
    })

    gsap.to(this.statsContainer, {
      alpha: 1,
      duration: 0.5,
      delay: 1.0,
    })

    // Add celebration effect for wins
    if (this.prizeValue > 0) {
      this.addCelebrationEffect()
    }
  }

  private createBackground(): void {
    this.backgroundGraphics.clear()
    
    // Create background color based on result
    const bgColor = this.prizeValue > 0 ? 
      this.mixColors(GAME_CONFIG.BACKGROUND_COLOR, COLORS.SUCCESS, 0.2) :
      GAME_CONFIG.BACKGROUND_COLOR

    this.backgroundGraphics.rect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT)
    this.backgroundGraphics.fill(bgColor)

    // Add decorative elements
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * GAME_CONFIG.WIDTH
      const y = Math.random() * GAME_CONFIG.HEIGHT
      const radius = Math.random() * 3 + 1
      
      this.backgroundGraphics.circle(x, y, radius)
      this.backgroundGraphics.fill(COLORS.WHITE, 0.1)
    }
  }

  private createStatsDisplay(): void {
    const store = useGameStore.getState()
    
    const statsText = new Text({
      text: `Games: ${store.gameHistory.length} | Win Rate: ${store.getWinRate().toFixed(1)}% | Total Winnings: ${formatCurrency(store.getTotalWinnings())}`,
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 14,
        fill: COLORS.GRAY,
        align: 'center',
      }),
    })

    statsText.anchor.set(0.5)
    statsText.x = GAME_CONFIG.WIDTH / 2
    statsText.y = 450

    this.statsContainer.addChild(statsText)
  }

  private updateBalanceText(): void {
    const store = useGameStore.getState()
    this.balanceText.text = `Current Balance: ${formatCurrency(store.balance)}`
  }

  private updateButtonStates(): void {
    const store = useGameStore.getState()
    this.playAgainButton.setEnabled(store.canAffordCard())
  }

  private addCelebrationEffect(): void {
    // Create particle effect for celebration
    for (let i = 0; i < 20; i++) {
      const particle = new Graphics()
      particle.circle(0, 0, Math.random() * 4 + 2)
      particle.fill(Math.random() > 0.5 ? COLORS.SECONDARY : COLORS.SUCCESS)
      
      particle.x = GAME_CONFIG.WIDTH / 2 + (Math.random() - 0.5) * 100
      particle.y = GAME_CONFIG.HEIGHT / 2 + (Math.random() - 0.5) * 100
      
      this.addChild(particle)

      // Animate particles
      gsap.to(particle, {
        x: particle.x + (Math.random() - 0.5) * 200,
        y: particle.y + (Math.random() - 0.5) * 200,
        alpha: 0,
        duration: 2,
        delay: Math.random() * 0.5,
        onComplete: () => {
          particle.destroy()
        },
      })
    }
  }

  private mixColors(color1: number, color2: number, ratio: number): number {
    const r1 = (color1 >> 16) & 0xff
    const g1 = (color1 >> 8) & 0xff
    const b1 = color1 & 0xff
    
    const r2 = (color2 >> 16) & 0xff
    const g2 = (color2 >> 8) & 0xff
    const b2 = color2 & 0xff
    
    const r = Math.round(r1 + (r2 - r1) * ratio)
    const g = Math.round(g1 + (g2 - g1) * ratio)
    const b = Math.round(b1 + (b2 - b1) * ratio)
    
    return (r << 16) | (g << 8) | b
  }

  private async playAgain(): Promise<void> {
    await this.router.navigateTo(SCENES.GAME)
  }

  private async goToMenu(): Promise<void> {
    await this.router.navigateTo(SCENES.MENU)
  }

  update(deltaTime: number): void {
    // Rotate background slightly for subtle animation
    this.backgroundGraphics.rotation += 0.0005 * deltaTime
  }

  destroy(): void {
    this.playAgainButton.destroy()
    this.menuButton.destroy()
    gsap.killTweensOf(this.resultText)
    gsap.killTweensOf(this.prizeText.scale)
    gsap.killTweensOf(this.balanceText)
    gsap.killTweensOf(this.playAgainButton)
    gsap.killTweensOf(this.menuButton)
    gsap.killTweensOf(this.statsContainer)
    super.destroy()
  }
}