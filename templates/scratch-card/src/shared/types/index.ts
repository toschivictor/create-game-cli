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

export interface ScratchCard {
  id: string
  width: number
  height: number
  scratchedPercentage: number
  isRevealed: boolean
  prize?: string
  prizeValue?: number
}

export interface GameState {
  currentScene: string
  isLoading: boolean
  scratchCard: ScratchCard | null
  balance: number
  gameHistory: GameResult[]
}

export interface GameResult {
  id: string
  timestamp: number
  prizeValue: number
  cardCost: number
}

export type SceneName = 'loading' | 'menu' | 'game' | 'result'

export interface RouteChangeEvent {
  from: SceneName | null
  to: SceneName
  data?: SceneData
}