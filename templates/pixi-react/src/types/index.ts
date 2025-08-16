export interface GameState {
  currentScene: SceneName
  isLoading: boolean
  score: number
  lives: number
  level: number
  gameStarted: boolean
  gamePaused: boolean
  gameOver: boolean
}

export type SceneName = 'menu' | 'game' | 'gameOver'

export interface Player {
  x: number
  y: number
  velocity: { x: number; y: number }
  width: number
  height: number
  speed: number
  color: number
}

export interface Enemy {
  id: string
  x: number
  y: number
  velocity: { x: number; y: number }
  width: number
  height: number
  color: number
  health: number
}

export interface Bullet {
  id: string
  x: number
  y: number
  velocity: { x: number; y: number }
  width: number
  height: number
  color: number
  damage: number
}