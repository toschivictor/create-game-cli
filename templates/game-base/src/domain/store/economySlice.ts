import { create } from 'zustand'

interface EconomyState {
  balance: number
  addToBalance: (amount: number) => void
  subtractFromBalance: (amount: number) => void
}

export const useEconomyStore = create<EconomyState>()((set) => ({
  balance: 100,
  addToBalance: (amount) => set((s) => ({ balance: s.balance + amount })),
  subtractFromBalance: (amount) => set((s) => ({ balance: Math.max(0, s.balance - amount) })),
}))
