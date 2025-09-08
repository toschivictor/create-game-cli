import { BaseScene } from '@/core/scenes/BaseScene'
import type { SceneRouter } from '@/core/router/SceneRouter'
import { Text, TextStyle } from 'pixi.js'

export class GameScene extends BaseScene {
  name: string = 'game'
  constructor(private router: SceneRouter) { super() }

  async init(): Promise<void> {
    const text = new Text({ text: 'Game - Placeholder', style: new TextStyle({ fontSize: 20, fill: 0xffffff }) })
    text.anchor.set(0.5)
    text.x = 400
    text.y = 300
    this.addChild(text)

    setTimeout(() => { this.router.navigateTo('result', { prizeValue: 0 }) }, 1000)
  }
}
