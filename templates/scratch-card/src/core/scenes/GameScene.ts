import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'
import type { Scene, SceneData } from '@/shared/types'
import type { SceneRouter } from '@/core/router/SceneRouter'
import { GAME_CONFIG, COLORS, SCENES, SCRATCH_CARD_CONFIG } from '@/shared/constants'
import { useGameStore } from '@/shared/store/gameStore'
import { formatCurrency, createScratchCard, generateId } from '@/shared/utils'
import { ScratchCardComponent } from '@/features/scratch-card/components/ScratchCardComponent'
import { Button } from '@/ui/components/Button'

export class GameScene extends Container implements Scene {
  name: string = SCENES.GAME
  private router: SceneRouter
  private scratchCard: ScratchCardComponent
  private balanceText: Text
  private instructionText: Text
  private backButton: Button
  private backgroundGraphics: Graphics
  
  private unsubscribe?: () => void

  constructor(router: SceneRouter) {
    super()
    this.router = router
    
    this.backgroundGraphics = new Graphics()
    this.balanceText = new Text({
      text: '',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 20,
        fill: COLORS.SECONDARY,
        align: 'center',
      }),
    })

    this.instructionText = new Text({
      text: 'Scratch the card to reveal your prize!',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 18,
        fill: COLORS.WHITE,
        align: 'center',
      }),
    })

    this.backButton = new Button({
      text: 'Back to Menu',
      width: 120,
      height: 40,
      style: {
        backgroundColor: COLORS.GRAY,
        textColor: COLORS.WHITE,
        fontSize: 14,
      },
      onClick: () => this.goBack(),
    })

    // Create scratch card component (will be initialized in init)
    this.scratchCard = new ScratchCardComponent()
  }

  async init(): Promise<void> {
    // Set up background
    this.createBackground()
    
    // Set up balance display
    this.balanceText.anchor.set(0.5)
    this.balanceText.x = GAME_CONFIG.WIDTH / 2
    this.balanceText.y = 50

    // Set up instruction text
    this.instructionText.anchor.set(0.5)
    this.instructionText.x = GAME_CONFIG.WIDTH / 2
    this.instructionText.y = 150

    // Set up back button
    this.backButton.x = 20
    this.backButton.y = 20

    // Set up scratch card
    this.scratchCard.x = GAME_CONFIG.WIDTH / 2 - SCRATCH_CARD_CONFIG.WIDTH / 2
    this.scratchCard.y = GAME_CONFIG.HEIGHT / 2 - SCRATCH_CARD_CONFIG.HEIGHT / 2

    // Add all elements
    this.addChild(this.backgroundGraphics)
    this.addChild(this.balanceText)
    this.addChild(this.instructionText)
    this.addChild(this.backButton)
    this.addChild(this.scratchCard)

    // Subscribe to store changes
    this.subscribeToStore()
    
    // Initialize the game
    this.startNewGame()
    
    // Update display
    this.updateDisplay()
  }

  async onEnter(): Promise<void> {
    // Animate entrance
    this.balanceText.alpha = 0
    this.instructionText.alpha = 0
    this.backButton.alpha = 0
    this.scratchCard.alpha = 0

    gsap.to(this.balanceText, {
      alpha: 1,
      duration: 0.6,
      delay: 0.1,
    })

    gsap.to(this.instructionText, {
      alpha: 1,
      duration: 0.6,
      delay: 0.2,
    })

    gsap.to(this.backButton, {
      alpha: 1,
      duration: 0.6,
      delay: 0.3,
    })

    gsap.to(this.scratchCard, {
      alpha: 1,
      duration: 0.8,
      delay: 0.4,
      ease: 'back.out(1.7)',
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
    
    // Add some subtle texture
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * GAME_CONFIG.WIDTH
      const y = Math.random() * GAME_CONFIG.HEIGHT
      const radius = Math.random() * 2 + 0.5
      
      this.backgroundGraphics.circle(x, y, radius)
      this.backgroundGraphics.fill(COLORS.WHITE, 0.05)
    }
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
  }

  private startNewGame(): void {
    const store = useGameStore.getState()
    
    // Deduct card cost
    store.subtractFromBalance(SCRATCH_CARD_CONFIG.CARD_COST)
    
    // Create new scratch card
    const newCard = createScratchCard()
    store.setScratchCard(newCard)
    
    // Initialize the scratch card component
    this.scratchCard.initCard(newCard, this.onCardRevealed.bind(this))
  }

  private onCardRevealed(): void {
    const store = useGameStore.getState()
    const card = store.scratchCard
    
    if (!card) return

    // Update instruction text
    this.instructionText.text = card.prizeValue > 0 
      ? `Congratulations! You won ${formatCurrency(card.prizeValue)}!`
      : 'Better luck next time!'

    // Add winnings to balance
    if (card.prizeValue > 0) {
      store.addToBalance(card.prizeValue)
    }

    // Add to game history
    store.addGameResult({
      id: generateId(),
      timestamp: Date.now(),
      prizeValue: card.prizeValue,
      cardCost: SCRATCH_CARD_CONFIG.CARD_COST,
    })

    // Automatically transition to result scene after a delay
    setTimeout(() => {
      this.router.navigateTo(SCENES.RESULT, { 
        prizeValue: card.prizeValue,
        prizeLabel: card.prize 
      })
    }, 3000)
  }

  private async goBack(): Promise<void> {
    await this.router.navigateTo(SCENES.MENU)
  }

  update(deltaTime: number): void {
    // Update scratch card
    this.scratchCard.update(deltaTime)
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    this.scratchCard.destroy()
    this.backButton.destroy()
    gsap.killTweensOf(this.balanceText)
    gsap.killTweensOf(this.instructionText)
    gsap.killTweensOf(this.backButton)
    gsap.killTweensOf(this.scratchCard)
    super.destroy()
  }
}