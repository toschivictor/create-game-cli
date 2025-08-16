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

export const SLOT_CONFIG = {
  REELS: 5,
  ROWS: 3,
  REEL_WIDTH: 120,
  REEL_HEIGHT: 360,
  SYMBOL_HEIGHT: 120,
  MIN_BET: 1,
  MAX_BET: 100,
  DEFAULT_BET: 10,
  SPIN_DURATION: 2.0,
  REEL_STOP_DELAY: 0.3,
} as const

export const SYMBOLS = [
  { id: 'cherry', name: 'Cherry', value: 5, color: 0xff4444 },
  { id: 'lemon', name: 'Lemon', value: 10, color: 0xffff44 },
  { id: 'orange', name: 'Orange', value: 15, color: 0xff8844 },
  { id: 'grape', name: 'Grape', value: 20, color: 0x8844ff },
  { id: 'bell', name: 'Bell', value: 50, color: 0x44ff88 },
  { id: 'bar', name: 'Bar', value: 100, color: 0x4488ff },
  { id: 'seven', name: 'Seven', value: 200, color: 0xff44ff },
  { id: 'diamond', name: 'Diamond', value: 500, color: 0x44ffff },
] as const

export const PAYLINES = [
  { id: 1, positions: [1, 1, 1, 1, 1], multiplier: 1 }, // Middle row
  { id: 2, positions: [0, 0, 0, 0, 0], multiplier: 1 }, // Top row
  { id: 3, positions: [2, 2, 2, 2, 2], multiplier: 1 }, // Bottom row
  { id: 4, positions: [0, 1, 2, 1, 0], multiplier: 2 }, // V shape
  { id: 5, positions: [2, 1, 0, 1, 2], multiplier: 2 }, // ^ shape
  { id: 6, positions: [0, 0, 1, 2, 2], multiplier: 3 }, // Rising diagonal
  { id: 7, positions: [2, 2, 1, 0, 0], multiplier: 3 }, // Falling diagonal
  { id: 8, positions: [1, 0, 0, 0, 1], multiplier: 4 }, // W shape
  { id: 9, positions: [1, 2, 2, 2, 1], multiplier: 4 }, // M shape
] as const

export const SYMBOL_PROBABILITIES = {
  cherry: 0.25,
  lemon: 0.20,
  orange: 0.15,
  grape: 0.12,
  bell: 0.10,
  bar: 0.08,
  seven: 0.06,
  diamond: 0.04,
} as const

export const ANIMATIONS = {
  SCENE_TRANSITION_DURATION: 0.5,
  REEL_SPIN_DURATION: 2.0,
  WIN_CELEBRATION_DURATION: 2.0,
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
  GOLD: 0xffd700,
} as const

export const JACKPOT_THRESHOLD = 1000 // Minimum win amount to be considered jackpot