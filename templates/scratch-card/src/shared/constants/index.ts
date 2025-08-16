export const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  BACKGROUND_COLOR: 0x1a1a2e,
  ANTIALIAS: true,
} as const

export const SCENES = {
  LOADING: 'loading',
  MENU: 'menu',
  GAME: 'game',
  RESULT: 'result',
} as const

export const SCRATCH_CARD_CONFIG = {
  WIDTH: 300,
  HEIGHT: 200,
  SCRATCH_THRESHOLD: 0.7, // 70% scratched to reveal
  BRUSH_SIZE: 20,
  CARD_COST: 5,
} as const

export const PRIZES = [
  { value: 0, probability: 0.6, label: 'Try Again' },
  { value: 5, probability: 0.2, label: '$5' },
  { value: 10, probability: 0.1, label: '$10' },
  { value: 25, probability: 0.05, label: '$25' },
  { value: 50, probability: 0.03, label: '$50' },
  { value: 100, probability: 0.015, label: '$100' },
  { value: 500, probability: 0.005, label: '$500' },
] as const

export const ANIMATIONS = {
  SCENE_TRANSITION_DURATION: 0.5,
  CARD_REVEAL_DURATION: 1.0,
  UI_FADE_DURATION: 0.3,
} as const

export const COLORS = {
  PRIMARY: 0x4f46e5,
  SECONDARY: 0xeab308,
  SUCCESS: 0x10b981,
  DANGER: 0xef4444,
  WHITE: 0xffffff,
  BLACK: 0x000000,
  GRAY: 0x6b7280,
} as const