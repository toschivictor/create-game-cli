import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { GameState, SceneName, Player, Enemy, Bullet } from '@/types'

interface GameStore extends GameState {
  // Game entities
  player: Player
  enemies: Enemy[]
  bullets: Bullet[]
  
  // Actions
  setCurrentScene: (scene: SceneName) => void
  setLoading: (loading: boolean) => void
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  restartGame: () => void
  
  // Player actions
  updatePlayer: (updates: Partial<Player>) => void
  
  // Game actions
  addScore: (points: number) => void
  loseLife: () => void
  nextLevel: () => void
  
  // Entity management
  addEnemy: (enemy: Enemy) => void
  removeEnemy: (id: string) => void
  updateEnemy: (id: string, updates: Partial<Enemy>) => void
  addBullet: (bullet: Bullet) => void
  removeBullet: (id: string) => void
  updateBullet: (id: string, updates: Partial<Bullet>) => void
  clearEntities: () => void
}

const initialState: GameState = {
  currentScene: 'menu',
  isLoading: false,
  score: 0,
  lives: 3,
  level: 1,
  gameStarted: false,
  gamePaused: false,
  gameOver: false,
}

const initialPlayer: Player = {
  x: 400,
  y: 500,
  velocity: { x: 0, y: 0 },
  width: 40,
  height: 40,
  speed: 300,
  color: 0x00ff00,
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      player: initialPlayer,
      enemies: [],
      bullets: [],

      // Scene management
      setCurrentScene: (scene: SceneName) =>
        set((state) => ({ ...state, currentScene: scene }), false, 'setCurrentScene'),

      setLoading: (loading: boolean) =>
        set((state) => ({ ...state, isLoading: loading }), false, 'setLoading'),

      // Game flow
      startGame: () =>
        set(
          (state) => ({
            ...state,
            gameStarted: true,
            gameOver: false,
            gamePaused: false,
            currentScene: 'game',
            score: 0,
            lives: 3,
            level: 1,
          }),
          false,
          'startGame'
        ),

      pauseGame: () =>
        set((state) => ({ ...state, gamePaused: true }), false, 'pauseGame'),

      resumeGame: () =>
        set((state) => ({ ...state, gamePaused: false }), false, 'resumeGame'),

      endGame: () =>
        set(
          (state) => ({
            ...state,
            gameOver: true,
            gameStarted: false,
            currentScene: 'gameOver',
          }),
          false,
          'endGame'
        ),

      restartGame: () => {
        set(
          () => ({
            ...initialState,
            player: { ...initialPlayer },
            enemies: [],
            bullets: [],
          }),
          false,
          'restartGame'
        )
      },

      // Player management
      updatePlayer: (updates: Partial<Player>) =>
        set(
          (state) => ({ ...state, player: { ...state.player, ...updates } }),
          false,
          'updatePlayer'
        ),

      // Score and progression
      addScore: (points: number) =>
        set((state) => ({ ...state, score: state.score + points }), false, 'addScore'),

      loseLife: () =>
        set((state) => {
          const newLives = state.lives - 1
          if (newLives <= 0) {
            return { ...state, lives: 0, gameOver: true, currentScene: 'gameOver' }
          }
          return { ...state, lives: newLives }
        }, false, 'loseLife'),

      nextLevel: () =>
        set((state) => ({ ...state, level: state.level + 1 }), false, 'nextLevel'),

      // Entity management
      addEnemy: (enemy: Enemy) =>
        set(
          (state) => ({ ...state, enemies: [...state.enemies, enemy] }),
          false,
          'addEnemy'
        ),

      removeEnemy: (id: string) =>
        set(
          (state) => ({ ...state, enemies: state.enemies.filter(e => e.id !== id) }),
          false,
          'removeEnemy'
        ),

      updateEnemy: (id: string, updates: Partial<Enemy>) =>
        set(
          (state) => ({
            ...state,
            enemies: state.enemies.map(e =>
              e.id === id ? { ...e, ...updates } : e
            ),
          }),
          false,
          'updateEnemy'
        ),

      addBullet: (bullet: Bullet) =>
        set(
          (state) => ({ ...state, bullets: [...state.bullets, bullet] }),
          false,
          'addBullet'
        ),

      removeBullet: (id: string) =>
        set(
          (state) => ({ ...state, bullets: state.bullets.filter(b => b.id !== id) }),
          false,
          'removeBullet'
        ),

      updateBullet: (id: string, updates: Partial<Bullet>) =>
        set(
          (state) => ({
            ...state,
            bullets: state.bullets.map(b =>
              b.id === id ? { ...b, ...updates } : b
            ),
          }),
          false,
          'updateBullet'
        ),

      clearEntities: () =>
        set(
          (state) => ({ ...state, enemies: [], bullets: [] }),
          false,
          'clearEntities'
        ),
    }),
    {
      name: 'pixi-react-game-store',
    }
  )
)