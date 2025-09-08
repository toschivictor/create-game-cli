import type { EventBus } from '@/core/messaging/EventBus'

export type AppEvents = {
  ExternalMessageReceived: { type: string; payload: unknown }
  SendExternalMessage: { type: string; payload: unknown }
}

export interface ExternalPort {
  start(): void
  stop(): void
  send(type: string, payload: unknown): void
}

export class ThirdPartyAdapter implements ExternalPort {
  private unsub?: () => void
  constructor(private bus: EventBus<AppEvents>, private sdk: { on: Function; send: Function; off?: Function }) {}

  start(): void {
    const handler = (msg: any) => this.bus.emit('ExternalMessageReceived', msg)
    this.sdk.on('message', handler)
    this.unsub = this.bus.on('SendExternalMessage', ({ type, payload }) => this.sdk.send(type, payload))
  }

  stop(): void {
    if (this.sdk.off) this.sdk.off('message')
    if (this.unsub) this.unsub()
  }

  send(type: string, payload: unknown): void {
    this.bus.emit('SendExternalMessage', { type, payload })
  }
}
