import { create } from 'zustand'

interface SessionState {
  currentScene: string
  isLoading: boolean
  setCurrentScene: (scene: string) => void
  setLoading: (loading: boolean) => void
}

export const useSessionStore = create<SessionState>()((set) => ({
  currentScene: 'loading',
  isLoading: true,
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setLoading: (isLoading) => set({ isLoading }),
}))
