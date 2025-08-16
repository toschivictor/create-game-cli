import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { GameState, GameResult, ScratchCard, SceneName } from '@/shared/types'
import { SCRATCH_CARD_CONFIG } from '@/shared/constants'

interface GameStore extends GameState {
  // Actions
  setCurrentScene: (scene: SceneName) => void
  setLoading: (loading: boolean) => void
  setScratchCard: (card: ScratchCard | null) => void
  updateScratchCard: (updates: Partial<ScratchCard>) => void
  addToBalance: (amount: number) => void
  subtractFromBalance: (amount: number) => void
  addGameResult: (result: GameResult) => void
  resetGame: () => void
  
  // Computed values
  canAffordCard: () => boolean
  getTotalWinnings: () => number
  getWinRate: () => number
}

const initialState: GameState = {
  currentScene: 'loading',
  isLoading: true,
  scratchCard: null,
  balance: 100, // Starting balance
  gameHistory: [],
}

export const useGameStore = create<GameStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Actions
      setCurrentScene: (scene: SceneName) =>
        set((state) => ({ ...state, currentScene: scene }), false, 'setCurrentScene'),

      setLoading: (loading: boolean) =>
        set((state) => ({ ...state, isLoading: loading }), false, 'setLoading'),

      setScratchCard: (card: ScratchCard | null) =>
        set((state) => ({ ...state, scratchCard: card }), false, 'setScratchCard'),

      updateScratchCard: (updates: Partial<ScratchCard>) =>
        set(
          (state) => ({
            ...state,
            scratchCard: state.scratchCard ? { ...state.scratchCard, ...updates } : null,
          }),
          false,
          'updateScratchCard'
        ),

      addToBalance: (amount: number) =>
        set(
          (state) => ({ ...state, balance: state.balance + amount }),
          false,
          'addToBalance'
        ),

      subtractFromBalance: (amount: number) =>
        set(
          (state) => ({ ...state, balance: Math.max(0, state.balance - amount) }),
          false,
          'subtractFromBalance'
        ),

      addGameResult: (result: GameResult) =>
        set(
          (state) => ({
            ...state,
            gameHistory: [result, ...state.gameHistory].slice(0, 50), // Keep last 50 games
          }),
          false,
          'addGameResult'
        ),

      resetGame: () =>
        set(() => initialState, false, 'resetGame'),

      // Computed values
      canAffordCard: () => get().balance >= SCRATCH_CARD_CONFIG.CARD_COST,

      getTotalWinnings: () =>
        get().gameHistory.reduce((total, result) => total + result.prizeValue, 0),

      getWinRate: () => {
        const history = get().gameHistory
        if (history.length === 0) return 0
        const wins = history.filter((result) => result.prizeValue > 0).length
        return (wins / history.length) * 100
      },
    })),
    {
      name: 'scratch-card-game-store',
    }
  )
)