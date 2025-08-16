import { 
  Container, 
  Graphics, 
  Text, 
  TextStyle, 
  RenderTexture, 
  Sprite,
  FederatedPointerEvent
} from 'pixi.js'
import { gsap } from 'gsap'
import type { ScratchCard } from '@/shared/types'
import { SCRATCH_CARD_CONFIG, COLORS } from '@/shared/constants'
import { calculateScratchPercentage, formatCurrency } from '@/shared/utils'

export class ScratchCardComponent extends Container {
  private card: ScratchCard | null = null
  private cardBackground: Graphics
  private prizeText: Text
  private scratchOverlay: Graphics
  private maskTexture: RenderTexture
  private maskSprite: Sprite
  private isScratching: boolean = false
  private scratchedPixels: number = 0
  private totalPixels: number = 0
  private onRevealCallback?: () => void

  constructor() {
    super()
    
    this.cardBackground = new Graphics()
    this.prizeText = new Text({
      text: '',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 36,
        fill: COLORS.WHITE,
        align: 'center',
        fontWeight: 'bold',
        stroke: COLORS.BLACK,
        strokeThickness: 2,
      }),
    })
    this.scratchOverlay = new Graphics()
    
    // Create mask texture for scratching effect
    this.maskTexture = RenderTexture.create({
      width: SCRATCH_CARD_CONFIG.WIDTH,
      height: SCRATCH_CARD_CONFIG.HEIGHT,
    })
    
    this.maskSprite = new Sprite(this.maskTexture)
    
    this.setupCard()
    this.setupInteractions()
  }

  private setupCard(): void {
    // Create card background
    this.cardBackground.roundRect(0, 0, SCRATCH_CARD_CONFIG.WIDTH, SCRATCH_CARD_CONFIG.HEIGHT, 12)
    this.cardBackground.fill(COLORS.SECONDARY)
    this.cardBackground.stroke({ width: 3, color: COLORS.WHITE })
    
    // Position prize text
    this.prizeText.anchor.set(0.5)
    this.prizeText.x = SCRATCH_CARD_CONFIG.WIDTH / 2
    this.prizeText.y = SCRATCH_CARD_CONFIG.HEIGHT / 2
    
    // Create scratch overlay
    this.createScratchOverlay()
    
    // Add to container
    this.addChild(this.cardBackground)
    this.addChild(this.prizeText)
    this.addChild(this.scratchOverlay)
    
    // Set up masking for scratch effect
    this.scratchOverlay.mask = this.maskSprite
    this.addChild(this.maskSprite)
    
    // Initially fill the mask to hide the overlay
    this.resetMask()
  }

  private createScratchOverlay(): void {
    this.scratchOverlay.clear()
    
    // Create silver/gray scratch surface
    this.scratchOverlay.roundRect(0, 0, SCRATCH_CARD_CONFIG.WIDTH, SCRATCH_CARD_CONFIG.HEIGHT, 12)
    this.scratchOverlay.fill(0xc0c0c0) // Silver color
    
    // Add texture pattern
    for (let x = 0; x < SCRATCH_CARD_CONFIG.WIDTH; x += 10) {
      for (let y = 0; y < SCRATCH_CARD_CONFIG.HEIGHT; y += 10) {
        if ((x + y) % 20 === 0) {
          this.scratchOverlay.circle(x, y, 1)
          this.scratchOverlay.fill(0xd0d0d0, 0.5)
        }
      }
    }
    
    // Add scratch instruction text
    const instructionText = new Text({
      text: 'Scratch Here',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 20,
        fill: COLORS.BLACK,
        align: 'center',
        fontWeight: 'bold',
      }),
    })
    
    instructionText.anchor.set(0.5)
    instructionText.x = SCRATCH_CARD_CONFIG.WIDTH / 2
    instructionText.y = SCRATCH_CARD_CONFIG.HEIGHT / 2
    
    this.scratchOverlay.addChild(instructionText)
  }

  private setupInteractions(): void {
    this.eventMode = 'static'
    this.cursor = 'pointer'

    this.on('pointerdown', this.onPointerDown.bind(this))
    this.on('pointermove', this.onPointerMove.bind(this))
    this.on('pointerup', this.onPointerUp.bind(this))
    this.on('pointerupoutside', this.onPointerUpOutside.bind(this))
  }

  private onPointerDown(event: FederatedPointerEvent): void {
    if (!this.card || this.card.isRevealed) return
    
    this.isScratching = true
    this.scratch(event.global.x - this.x, event.global.y - this.y)
  }

  private onPointerMove(event: FederatedPointerEvent): void {
    if (!this.isScratching || !this.card || this.card.isRevealed) return
    
    this.scratch(event.global.x - this.x, event.global.y - this.y)
  }

  private onPointerUp(event: FederatedPointerEvent): void {
    this.isScratching = false
  }

  private onPointerUpOutside(event: FederatedPointerEvent): void {
    this.isScratching = false
  }

  private scratch(x: number, y: number): void {
    if (!this.card) return

    // Create scratch mark on mask
    const scratchGraphics = new Graphics()
    scratchGraphics.circle(x, y, SCRATCH_CARD_CONFIG.BRUSH_SIZE)
    scratchGraphics.fill(0xffffff) // White to reveal
    
    // Render to mask texture
    const app = this.parent?.parent as any // Get the PIXI app
    if (app?.renderer) {
      app.renderer.render(scratchGraphics, {
        renderTexture: this.maskTexture,
        clear: false,
      })
    }
    
    // Update scratched percentage
    this.scratchedPixels += Math.PI * SCRATCH_CARD_CONFIG.BRUSH_SIZE ** 2
    this.totalPixels = SCRATCH_CARD_CONFIG.WIDTH * SCRATCH_CARD_CONFIG.HEIGHT
    
    const percentage = calculateScratchPercentage(this.scratchedPixels, this.totalPixels)
    this.card.scratchedPercentage = percentage
    
    // Check if card should be revealed
    if (percentage >= SCRATCH_CARD_CONFIG.SCRATCH_THRESHOLD * 100 && !this.card.isRevealed) {
      this.revealCard()
    }
    
    scratchGraphics.destroy()
  }

  private resetMask(): void {
    // Fill mask with black to hide everything initially
    const blackGraphics = new Graphics()
    blackGraphics.rect(0, 0, SCRATCH_CARD_CONFIG.WIDTH, SCRATCH_CARD_CONFIG.HEIGHT)
    blackGraphics.fill(0x000000)
    
    const app = this.parent?.parent as any
    if (app?.renderer) {
      app.renderer.render(blackGraphics, {
        renderTexture: this.maskTexture,
        clear: true,
      })
    }
    
    blackGraphics.destroy()
  }

  private revealCard(): void {
    if (!this.card) return
    
    this.card.isRevealed = true
    
    // Animate revealing the entire card
    gsap.to(this.scratchOverlay, {
      alpha: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        this.scratchOverlay.visible = false
        if (this.onRevealCallback) {
          this.onRevealCallback()
        }
      },
    })
    
    // Add sparkle effect for wins
    if (this.card.prizeValue > 0) {
      this.addSparkleEffect()
    }
    
    // Animate prize text
    this.prizeText.scale.set(0.5)
    gsap.to(this.prizeText.scale, {
      x: 1.2,
      y: 1.2,
      duration: 0.5,
      ease: 'back.out(2)',
      yoyo: true,
      repeat: 1,
    })
  }

  private addSparkleEffect(): void {
    // Create sparkle particles around the card
    for (let i = 0; i < 15; i++) {
      const sparkle = new Graphics()
      sparkle.star(0, 0, 4, 4, 2)
      sparkle.fill(COLORS.SECONDARY)
      
      sparkle.x = Math.random() * SCRATCH_CARD_CONFIG.WIDTH
      sparkle.y = Math.random() * SCRATCH_CARD_CONFIG.HEIGHT
      sparkle.scale.set(0)
      
      this.addChild(sparkle)
      
      // Animate sparkles
      gsap.to(sparkle.scale, {
        x: 1,
        y: 1,
        duration: 0.3,
        delay: Math.random() * 0.5,
        ease: 'back.out(2)',
      })
      
      gsap.to(sparkle, {
        alpha: 0,
        rotation: Math.PI * 2,
        duration: 1.5,
        delay: Math.random() * 0.5,
        onComplete: () => {
          sparkle.destroy()
        },
      })
    }
  }

  /**
   * Initialize the card with data and callback
   */
  initCard(cardData: ScratchCard, onReveal?: () => void): void {
    this.card = cardData
    this.onRevealCallback = onReveal
    
    // Set prize text
    this.prizeText.text = cardData.prize || 'No Prize'
    this.prizeText.style.fill = cardData.prizeValue > 0 ? COLORS.SUCCESS : COLORS.DANGER
    
    // Reset card state
    this.scratchOverlay.alpha = 1
    this.scratchOverlay.visible = true
    this.scratchedPixels = 0
    this.isScratching = false
    
    // Reset mask
    this.resetMask()
    
    // Entrance animation
    this.scale.set(0.8)
    this.alpha = 0
    
    gsap.to(this, {
      alpha: 1,
      duration: 0.5,
    })
    
    gsap.to(this.scale, {
      x: 1,
      y: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
  }

  /**
   * Auto-reveal the card (for testing or timeout)
   */
  autoReveal(): void {
    if (this.card && !this.card.isRevealed) {
      this.revealCard()
    }
  }

  update(deltaTime: number): void {
    // Add subtle floating animation
    if (this.card && !this.card.isRevealed) {
      this.y += Math.sin(Date.now() * 0.001) * 0.2 * deltaTime
    }
  }

  destroy(): void {
    this.maskTexture.destroy()
    gsap.killTweensOf(this)
    gsap.killTweensOf(this.scratchOverlay)
    gsap.killTweensOf(this.prizeText.scale)
    gsap.killTweensOf(this.scale)
    super.destroy()
  }
}