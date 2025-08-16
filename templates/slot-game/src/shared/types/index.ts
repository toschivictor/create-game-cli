import type { Container } from 'pixi.js'

export interface GameConfig {
  width: number
  height: number
  backgroundColor: number
  antialias: boolean
}

export interface SceneData {
  [key: string]: unknown
}

export interface Scene extends Container {
  name: string
  init(data?: SceneData): void | Promise<void>
  update?(deltaTime: number): void
  destroy?(): void
  onEnter?(data?: SceneData): void | Promise<void>
  onExit?(): void | Promise<void>
}

export interface SlotSymbol {
  id: string
  name: string
  value: number
  texture?: string
  color: number
}

export interface SlotReel {
  id: number
  symbols: SlotSymbol[]
  position: number
  targetPosition: number
  isSpinning: boolean
  spinSpeed: number
}

export interface SlotMachine {
  id: string
  reels: SlotReel[]
  isSpinning: boolean
  betAmount: number
  lastWin: number
  totalSpins: number
}

export interface PayLine {
  id: number
  positions: number[] // Positions on each reel
  multiplier: number
}

export interface SpinResult {
  symbols: SlotSymbol[][]
  winningLines: PayLine[]
  totalWin: number
  isJackpot: boolean
}

export interface GameState {
  currentScene: string
  isLoading: boolean
  slotMachine: SlotMachine | null
  balance: number
  currentBet: number
  gameHistory: GameResult[]
  autoPlay: boolean
  autoPlaySpins: number
}

export interface GameResult {
  id: string
  timestamp: number
  bet: number
  win: number
  symbols: SlotSymbol[][]
  winningLines: PayLine[]
}

export type SceneName = 'loading' | 'menu' | 'game' | 'result'

export interface RouteChangeEvent {
  from: SceneName | null
  to: SceneName
  data?: SceneData
}