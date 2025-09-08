export function chooseWeighted<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0)
  let r = Math.random() * total
  for (const item of items) {
    if ((r -= item.weight) <= 0) return item
  }
  return items[items.length - 1]
}
