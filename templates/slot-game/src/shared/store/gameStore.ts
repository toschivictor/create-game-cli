import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { GameState, GameResult, SlotMachine, SceneName, SpinResult } from '@/shared/types'
import { SLOT_CONFIG } from '@/shared/constants'

interface GameStore extends GameState {
  // Actions
  setCurrentScene: (scene: SceneName) => void
  setLoading: (loading: boolean) => void
  setSlotMachine: (machine: SlotMachine | null) => void
  updateSlotMachine: (updates: Partial<SlotMachine>) => void
  setBet: (amount: number) => void
  addToBalance: (amount: number) => void
  subtractFromBalance: (amount: number) => void
  addGameResult: (result: GameResult) => void
  setAutoPlay: (enabled: boolean, spins?: number) => void
  resetGame: () => void
  
  // Computed values
  canAffordBet: () => boolean
  getTotalWinnings: () => number
  getWinRate: () => number
}

const initialState: GameState = {
  currentScene: 'loading',
  isLoading: true,
  slotMachine: null,
  balance: 1000, // Starting balance
  currentBet: SLOT_CONFIG.DEFAULT_BET,
  gameHistory: [],
  autoPlay: false,
  autoPlaySpins: 0,
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

      setSlotMachine: (machine: SlotMachine | null) =>
        set((state) => ({ ...state, slotMachine: machine }), false, 'setSlotMachine'),

      updateSlotMachine: (updates: Partial<SlotMachine>) =>
        set(
          (state) => ({
            ...state,
            slotMachine: state.slotMachine ? { ...state.slotMachine, ...updates } : null,
          }),
          false,
          'updateSlotMachine'
        ),

      setBet: (amount: number) =>
        set(
          (state) => ({ 
            ...state, 
            currentBet: Math.max(SLOT_CONFIG.MIN_BET, Math.min(SLOT_CONFIG.MAX_BET, amount))
          }),
          false,
          'setBet'
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
            gameHistory: [result, ...state.gameHistory].slice(0, 100), // Keep last 100 games
          }),
          false,
          'addGameResult'
        ),

      setAutoPlay: (enabled: boolean, spins?: number) =>
        set(
          (state) => ({
            ...state,
            autoPlay: enabled,
            autoPlaySpins: enabled ? (spins || 0) : 0,
          }),
          false,
          'setAutoPlay'
        ),

      resetGame: () =>
        set(() => initialState, false, 'resetGame'),

      // Computed values
      canAffordBet: () => get().balance >= get().currentBet,

      getTotalWinnings: () =>
        get().gameHistory.reduce((total, result) => total + result.win, 0),

      getWinRate: () => {
        const history = get().gameHistory
        if (history.length === 0) return 0
        const wins = history.filter((result) => result.win > 0).length
        return (wins / history.length) * 100
      },
    })),
    {
      name: 'slot-machine-game-store',
    }
  )
)