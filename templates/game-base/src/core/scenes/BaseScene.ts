import { Container } from 'pixi.js'

export abstract class BaseScene extends Container {
  abstract name: string
  init(data?: unknown): Promise<void> | void {}
  onEnter?(data?: unknown): Promise<void> | void
  onExit?(): Promise<void> | void
  update?(delta: number): void
}
