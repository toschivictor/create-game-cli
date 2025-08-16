import { SYMBOLS, SYMBOL_PROBABILITIES, PAYLINES, SLOT_CONFIG } from '@/shared/constants'
import type { SlotSymbol, SlotMachine, SlotReel, SpinResult, PayLine } from '@/shared/types'

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function getRandomSymbol(): SlotSymbol {
  const random = Math.random()
  let cumulativeProbability = 0

  for (const symbol of SYMBOLS) {
    const probability = SYMBOL_PROBABILITIES[symbol.id as keyof typeof SYMBOL_PROBABILITIES]
    cumulativeProbability += probability
    if (random <= cumulativeProbability) {
      return symbol
    }
  }

  // Fallback to the first symbol
  return SYMBOLS[0]
}

export function createSlotMachine(): SlotMachine {
  const reels: SlotReel[] = []
  
  for (let i = 0; i < SLOT_CONFIG.REELS; i++) {
    const symbols: SlotSymbol[] = []
    
    // Generate symbols for each reel (more than visible for spinning effect)
    for (let j = 0; j < 20; j++) {
      symbols.push(getRandomSymbol())
    }
    
    reels.push({
      id: i,
      symbols,
      position: 0,
      targetPosition: 0,
      isSpinning: false,
      spinSpeed: 0,
    })
  }
  
  return {
    id: generateId(),
    reels,
    isSpinning: false,
    betAmount: SLOT_CONFIG.DEFAULT_BET,
    lastWin: 0,
    totalSpins: 0,
  }
}

export function spinReels(machine: SlotMachine): SlotSymbol[][] {
  const result: SlotSymbol[][] = []
  
  // Generate new symbols for each reel
  for (let reelIndex = 0; reelIndex < SLOT_CONFIG.REELS; reelIndex++) {
    const reelSymbols: SlotSymbol[] = []
    
    for (let row = 0; row < SLOT_CONFIG.ROWS; row++) {
      reelSymbols.push(getRandomSymbol())
    }
    
    result.push(reelSymbols)
  }
  
  return result
}

export function checkWinningLines(symbols: SlotSymbol[][], bet: number): SpinResult {
  const winningLines: PayLine[] = []
  let totalWin = 0
  
  for (const payline of PAYLINES) {
    const lineSymbols: SlotSymbol[] = []
    
    // Get symbols for this payline
    for (let reelIndex = 0; reelIndex < SLOT_CONFIG.REELS; reelIndex++) {
      const row = payline.positions[reelIndex]
      lineSymbols.push(symbols[reelIndex][row])
    }
    
    // Check for winning combinations
    const win = calculateLineWin(lineSymbols, payline, bet)
    if (win > 0) {
      winningLines.push(payline)
      totalWin += win
    }
  }
  
  const isJackpot = totalWin >= 1000 // Simple jackpot threshold
  
  return {
    symbols,
    winningLines,
    totalWin,
    isJackpot,
  }
}

function calculateLineWin(symbols: SlotSymbol[], payline: PayLine, bet: number): number {
  // Simple win calculation - check for matching symbols from left to right
  if (symbols.length < 3) return 0
  
  const firstSymbol = symbols[0]
  let matchCount = 1
  
  for (let i = 1; i < symbols.length; i++) {
    if (symbols[i].id === firstSymbol.id) {
      matchCount++
    } else {
      break
    }
  }
  
  // Minimum 3 matching symbols to win
  if (matchCount >= 3) {
    const multiplier = matchCount === 5 ? 10 : matchCount === 4 ? 5 : 2
    return firstSymbol.value * bet * payline.multiplier * multiplier / 100
  }
  
  return 0
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}