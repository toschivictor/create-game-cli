import { BaseScene } from '@/core/scenes/BaseScene'
import type { SceneRouter } from '@/core/router/SceneRouter'
import { Text, TextStyle } from 'pixi.js'

export class MenuScene extends BaseScene {
  name: string = 'menu'
  constructor(private router: SceneRouter) { super() }

  async init(): Promise<void> {
    const text = new Text({ text: 'Menu - Click to Start', style: new TextStyle({ fontSize: 20, fill: 0xffffff }) })
    text.anchor.set(0.5)
    text.x = 400
    text.y = 300
    this.addChild(text)
    this.eventMode = 'static'
    this.on('pointerdown', async () => { await this.router.navigateTo('game') })
  }
}
