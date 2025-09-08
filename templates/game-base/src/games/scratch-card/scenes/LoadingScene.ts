import { BaseScene } from '@/core/scenes/BaseScene'
import { Text, TextStyle } from 'pixi.js'

export class LoadingScene extends BaseScene {
  name: string = 'loading'

  async init(): Promise<void> {
    const text = new Text({
      text: 'Loading...'
    , style: new TextStyle({ fontFamily: 'Arial', fontSize: 20, fill: 0xffffff }) })
    text.anchor.set(0.5)
    text.x = 400
    text.y = 300
    this.addChild(text)
  }
}
