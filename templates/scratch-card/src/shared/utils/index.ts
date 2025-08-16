import { PRIZES } from '@/shared/constants'
import type { ScratchCard } from '@/shared/types'

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function getRandomPrize(): { value: number; label: string } {
  const random = Math.random()
  let cumulativeProbability = 0

  for (const prize of PRIZES) {
    cumulativeProbability += prize.probability
    if (random <= cumulativeProbability) {
      return { value: prize.value, label: prize.label }
    }
  }

  // Fallback to the last prize (should never happen with proper probabilities)
  return PRIZES[PRIZES.length - 1]
}

export function createScratchCard(): ScratchCard {
  const prize = getRandomPrize()
  
  return {
    id: generateId(),
    width: 300,
    height: 200,
    scratchedPercentage: 0,
    isRevealed: false,
    prize: prize.label,
    prizeValue: prize.value,
  }
}

export function calculateScratchPercentage(
  scratchedPixels: number,
  totalPixels: number
): number {
  return Math.min((scratchedPixels / totalPixels) * 100, 100)
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