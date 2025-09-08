import { Container, Graphics, Text, TextStyle } from 'pixi.js'

export class Button extends Container {
  private bg: Graphics
  private label: Text
  constructor(text: string) {
    super()
    this.bg = new Graphics()
    this.bg.roundRect(0, 0, 140, 44, 8)
    this.bg.fill(0x4f46e5)
    this.addChild(this.bg)
    this.label = new Text({ text, style: new TextStyle({ fill: 0xffffff, fontSize: 16 }) })
    this.label.anchor.set(0.5)
    this.label.x = 70
    this.label.y = 22
    this.addChild(this.label)
    this.eventMode = 'static'
    this.cursor = 'pointer'
  }
}
