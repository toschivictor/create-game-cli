import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import type { Scene, SceneData } from '@/shared/types'
import type { SceneRouter } from '@/core/router/SceneRouter'
import { GAME_CONFIG, COLORS, SCENES } from '@/shared/constants'
import { useGameStore } from '@/shared/store/gameStore'
import { formatCurrency, createSlotMachine, generateId } from '@/shared/utils'
import { SlotMachineComponent } from '@/features/slot-machine/components/SlotMachineComponent'
import { Button } from '@/ui/components/Button'

export class GameScene extends Container implements Scene {
  name: string = SCENES.GAME
  private router: SceneRouter
  private slotMachine: SlotMachineComponent
  private balanceText: Text
  private winText: Text
  private spinButton: Button
  private backButton: Button
  private backgroundGraphics: Graphics

  constructor(router: SceneRouter) {
    super()
    this.router = router
    
    this.backgroundGraphics = new Graphics()
    this.balanceText = new Text({
      text: '',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 20,
        fill: COLORS.WHITE,
        align: 'center',
      }),
    })

    this.winText = new Text({
      text: '',
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: 24,
        fill: COLORS.SUCCESS,
        align: 'center',
        fontWeight: 'bold',
      }),
    })

    this.spinButton = new Button({
      text: 'SPIN',
      width: 120,
      height: 50,
      style: {
        backgroundColor: COLORS.PRIMARY,
        textColor: COLORS.WHITE,
        fontSize: 18,
      },
      onClick: () => this.spin(),
    })

    this.backButton = new Button({
      text: 'Menu',
      width: 80,
      height: 40,
      style: {
        backgroundColor: COLORS.GRAY,
        textColor: COLORS.WHITE,
        fontSize: 14,
      },
      onClick: () => this.goBack(),
    })

    this.slotMachine = new SlotMachineComponent()
  }

  async init(): Promise<void> {
    // Set up background
    this.createBackground()
    
    // Set up balance display
    this.balanceText.anchor.set(0.5)
    this.balanceText.x = GAME_CONFIG.WIDTH / 2
    this.balanceText.y = 50

    // Set up win text
    this.winText.anchor.set(0.5)
    this.winText.x = GAME_CONFIG.WIDTH / 2
    this.winText.y = 100

    // Set up slot machine
    this.slotMachine.x = GAME_CONFIG.WIDTH / 2 - 320
    this.slotMachine.y = 150

    // Set up buttons
    this.spinButton.x = GAME_CONFIG.WIDTH / 2 - 60
    this.spinButton.y = 500

    this.backButton.x = 20
    this.backButton.y = 20

    // Add all elements
    this.addChild(this.backgroundGraphics)
    this.addChild(this.balanceText)
    this.addChild(this.winText)
    this.addChild(this.slotMachine)
    this.addChild(this.spinButton)
    this.addChild(this.backButton)

    // Initialize slot machine
    const store = useGameStore.getState()
    const machine = createSlotMachine()
    store.setSlotMachine(machine)
    this.slotMachine.initMachine(machine, this.onSpinComplete.bind(this))
    
    this.updateDisplay()
  }

  private createBackground(): void {
    this.backgroundGraphics.clear()
    this.backgroundGraphics.rect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT)
    this.backgroundGraphics.fill(GAME_CONFIG.BACKGROUND_COLOR)
  }

  private updateDisplay(): void {
    const store = useGameStore.getState()
    this.balanceText.text = `Balance: ${formatCurrency(store.balance)} | Bet: ${formatCurrency(store.currentBet)}`
    this.spinButton.setEnabled(store.canAffordBet() && !store.slotMachine?.isSpinning)
  }

  private async spin(): Promise<void> {
    const store = useGameStore.getState()
    
    if (!store.canAffordBet() || !store.slotMachine) return

    // Deduct bet
    store.subtractFromBalance(store.currentBet)
    this.updateDisplay()

    // Clear previous win text
    this.winText.text = ''

    // Spin the machine
    await this.slotMachine.spin()
  }

  private onSpinComplete(result: any): void {
    const store = useGameStore.getState()
    
    if (result.totalWin > 0) {
      store.addToBalance(result.totalWin)
      this.winText.text = `WIN: ${formatCurrency(result.totalWin)}!`
    } else {
      this.winText.text = 'Try again!'
    }

    // Add to game history
    store.addGameResult({
      id: generateId(),
      timestamp: Date.now(),
      bet: store.currentBet,
      win: result.totalWin,
      symbols: result.symbols,
      winningLines: result.winningLines,
    })

    this.updateDisplay()
  }

  private async goBack(): Promise<void> {
    await this.router.navigateTo(SCENES.MENU)
  }

  update(deltaTime: number): void {
    this.slotMachine.update(deltaTime)
  }

  destroy(): void {
    this.slotMachine.destroy()
    this.spinButton.destroy()
    this.backButton.destroy()
    super.destroy()
  }
}