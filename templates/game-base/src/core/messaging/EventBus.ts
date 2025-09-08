export type EventMap = Record<string, any>

export class EventBus<E extends EventMap> {
  private listeners = new Map<keyof E, Set<(data: any) => void>>()

  on<K extends keyof E>(event: K, handler: (data: E[K]) => void): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    const set = this.listeners.get(event)!
    set.add(handler as any)
    return () => set.delete(handler as any)
  }

  emit<K extends keyof E>(event: K, data: E[K]): void {
    const set = this.listeners.get(event)
    if (!set) return
    for (const handler of set) handler(data)
  }

  clear(): void {
    this.listeners.clear()
  }
}
