import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'
import type { SlotMachine, SlotSymbol, SpinResult } from '@/shared/types'
import { SLOT_CONFIG, COLORS, SYMBOLS } from '@/shared/constants'

export class SlotMachineComponent extends Container {
  private machine: SlotMachine | null = null
  private reelContainers: Container[] = []
  private symbolTexts: Text[][] = []
  private background: Graphics
  private onSpinCompleteCallback?: (result: SpinResult) => void

  constructor() {
    super()
    
    this.background = new Graphics()
    this.setupMachine()
  }

  private setupMachine(): void {
    // Create background
    this.background.roundRect(0, 0, SLOT_CONFIG.REEL_WIDTH * SLOT_CONFIG.REELS + 40, SLOT_CONFIG.REEL_HEIGHT + 40, 20)
    this.background.fill(COLORS.BLACK)
    this.background.stroke({ width: 4, color: COLORS.GOLD })
    
    this.addChild(this.background)

    // Create reels
    for (let i = 0; i < SLOT_CONFIG.REELS; i++) {
      const reelContainer = new Container()
      reelContainer.x = 20 + i * SLOT_CONFIG.REEL_WIDTH
      reelContainer.y = 20
      
      this.reelContainers.push(reelContainer)
      this.addChild(reelContainer)
      
      // Create reel background
      const reelBg = new Graphics()
      reelBg.roundRect(0, 0, SLOT_CONFIG.REEL_WIDTH, SLOT_CONFIG.REEL_HEIGHT, 8)
      reelBg.fill(COLORS.WHITE)
      reelBg.stroke({ width: 2, color: COLORS.GRAY })
      reelContainer.addChild(reelBg)
      
      // Create symbol texts for this reel
      const reelSymbols: Text[] = []
      for (let j = 0; j < SLOT_CONFIG.ROWS; j++) {
        const symbolText = new Text({
          text: '?',
          style: new TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 32,
            fill: COLORS.BLACK,
            align: 'center',
            fontWeight: 'bold',
          }),
        })
        
        symbolText.anchor.set(0.5)
        symbolText.x = SLOT_CONFIG.REEL_WIDTH / 2
        symbolText.y = (j + 0.5) * SLOT_CONFIG.SYMBOL_HEIGHT
        
        reelContainer.addChild(symbolText)
        reelSymbols.push(symbolText)
      }
      
      this.symbolTexts.push(reelSymbols)
    }
  }

  initMachine(machine: SlotMachine, onSpinComplete?: (result: SpinResult) => void): void {
    this.machine = machine
    this.onSpinCompleteCallback = onSpinComplete
    
    // Display initial symbols
    this.displaySymbols()
  }

  private displaySymbols(): void {
    if (!this.machine) return
    
    for (let reelIndex = 0; reelIndex < SLOT_CONFIG.REELS; reelIndex++) {
      for (let row = 0; row < SLOT_CONFIG.ROWS; row++) {
        // Get a random symbol for display
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        const symbolText = this.symbolTexts[reelIndex][row]
        
        symbolText.text = this.getSymbolDisplay(symbol)
        symbolText.style.fill = symbol.color
      }
    }
  }

  private getSymbolDisplay(symbol: SlotSymbol): string {
    // Simple text representation of symbols
    const symbolMap: Record<string, string> = {
      cherry: '🍒',
      lemon: '🍋',
      orange: '🍊',
      grape: '🍇',
      bell: '🔔',
      bar: '▬',
      seven: '7',
      diamond: '💎',
    }
    
    return symbolMap[symbol.id] || symbol.name
  }

  async spin(): Promise<SpinResult> {
    if (!this.machine) {
      throw new Error('Machine not initialized')
    }

    // Mark machine as spinning
    this.machine.isSpinning = true

    // Animate spinning effect
    const spinPromises = this.reelContainers.map((reelContainer, index) => {
      return new Promise<void>((resolve) => {
        // Animate reel spinning
        gsap.to(reelContainer, {
          rotation: Math.PI * 4, // 2 full rotations
          duration: SLOT_CONFIG.SPIN_DURATION + index * SLOT_CONFIG.REEL_STOP_DELAY,
          ease: 'power2.out',
          onComplete: resolve,
        })
      })
    })

    // Wait for all reels to stop
    await Promise.all(spinPromises)

    // Reset rotations
    this.reelContainers.forEach(reel => {
      reel.rotation = 0
    })

    // Generate final symbols
    const finalSymbols: SlotSymbol[][] = []
    for (let reelIndex = 0; reelIndex < SLOT_CONFIG.REELS; reelIndex++) {
      const reelSymbols: SlotSymbol[] = []
      for (let row = 0; row < SLOT_CONFIG.ROWS; row++) {
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        reelSymbols.push(symbol)
        
        // Update display
        const symbolText = this.symbolTexts[reelIndex][row]
        symbolText.text = this.getSymbolDisplay(symbol)
        symbolText.style.fill = symbol.color
        
        // Add reveal animation
        symbolText.scale.set(0.5)
        gsap.to(symbolText.scale, {
          x: 1,
          y: 1,
          duration: 0.3,
          delay: reelIndex * 0.1,
          ease: 'back.out(2)',
        })
      }
      finalSymbols.push(reelSymbols)
    }

    // Calculate results (simplified)
    const spinResult: SpinResult = {
      symbols: finalSymbols,
      winningLines: [], // Simplified - no line checking
      totalWin: this.calculateSimpleWin(finalSymbols),
      isJackpot: false,
    }

    this.machine.isSpinning = false
    this.machine.totalSpins++

    if (this.onSpinCompleteCallback) {
      this.onSpinCompleteCallback(spinResult)
    }

    return spinResult
  }

  private calculateSimpleWin(symbols: SlotSymbol[][]): number {
    // Very simple win calculation - just check middle row for matching symbols
    const middleRow = symbols.map(reel => reel[1]) // Middle symbol of each reel
    const firstSymbol = middleRow[0]
    
    let matchCount = 1
    for (let i = 1; i < middleRow.length; i++) {
      if (middleRow[i].id === firstSymbol.id) {
        matchCount++
      } else {
        break
      }
    }
    
    if (matchCount >= 3) {
      return firstSymbol.value * matchCount * (this.machine?.betAmount || 10)
    }
    
    return 0
  }

  update(deltaTime: number): void {
    // Add subtle animation when not spinning
    if (this.machine && !this.machine.isSpinning) {
      this.background.y = Math.sin(Date.now() * 0.001) * 1
    }
  }

  destroy(): void {
    gsap.killTweensOf(this.reelContainers)
    this.symbolTexts.forEach(reel => {
      reel.forEach(symbol => {
        gsap.killTweensOf(symbol.scale)
      })
    })
    super.destroy()
  }
}