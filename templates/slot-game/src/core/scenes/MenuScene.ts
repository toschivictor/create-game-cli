import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'
import type { Scene, SceneData } from '@/shared/types'
import type { SceneRouter } from '@/core/router/SceneRouter'
import { GAME_CONFIG, COLORS, SCENES, SLOT_CONFIG } from '@/shared/constants'
import { useGameStore } from '@/shared/store/gameStore'
import { formatCurrency } from '@/shared/utils'
import { Button } from '@/ui/components/Button'

export class MenuScene extends Container implements Scene {
  name: string = SCENES.MENU
  private router: SceneRouter
  private titleText: Text
  private balanceText: Text
  private betText: Text
  private spinButton: Button
  private backgroundGraphics: Graphics

  constructor(router: SceneRouter) {
    super()
    this.router = router
    
    this.backgroundGraphics = new Graphics()
    this.titleText = new Text({
      text: 'Slot Machine',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 48,
        fill: COLORS.GOLD,
        align: 'center',
        fontWeight: 'bold',
      }),
    })
    
    this.balanceText = new Text({
      text: '',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 24,
        fill: COLORS.WHITE,
        align: 'center',
      }),
    })

    this.betText = new Text({
      text: '',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 20,
        fill: COLORS.SECONDARY,
        align: 'center',
      }),
    })

    this.spinButton = new Button({
      text: 'SPIN!',
      width: 200,
      height: 60,
      style: {
        backgroundColor: COLORS.PRIMARY,
        textColor: COLORS.WHITE,
        fontSize: 24,
      },
      onClick: () => this.startGame(),
    })
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

    // Set up bet display
    this.betText.anchor.set(0.5)
    this.betText.x = GAME_CONFIG.WIDTH / 2
    this.betText.y = 240

    // Set up spin button
    this.spinButton.x = GAME_CONFIG.WIDTH / 2 - this.spinButton.width / 2
    this.spinButton.y = 300

    // Add all elements
    this.addChild(this.backgroundGraphics)
    this.addChild(this.titleText)
    this.addChild(this.balanceText)
    this.addChild(this.betText)
    this.addChild(this.spinButton)

    // Update display
    this.updateDisplay()
  }

  async onEnter(): Promise<void> {
    this.updateDisplay()
  }

  private createBackground(): void {
    this.backgroundGraphics.clear()
    this.backgroundGraphics.rect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT)
    this.backgroundGraphics.fill(GAME_CONFIG.BACKGROUND_COLOR)
  }

  private updateDisplay(): void {
    const store = useGameStore.getState()
    this.balanceText.text = `Balance: ${formatCurrency(store.balance)}`
    this.betText.text = `Bet: ${formatCurrency(store.currentBet)}`
    
    this.spinButton.setEnabled(store.canAffordBet())
  }

  private async startGame(): Promise<void> {
    await this.router.navigateTo(SCENES.GAME)
  }

  update(deltaTime: number): void {
    // Simple animation
    this.titleText.rotation = Math.sin(Date.now() * 0.001) * 0.05
  }

  destroy(): void {
    this.spinButton.destroy()
    super.destroy()
  }
}