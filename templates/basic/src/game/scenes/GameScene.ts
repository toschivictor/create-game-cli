import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { Player } from '../objects/Player'

export class GameScene extends Container {
  private player: Player
  private titleText: Text
  private instructionText: Text

  constructor() {
    super()
    
    // Create game objects
    this.player = new Player()
    
    // Create UI text
    this.titleText = new Text({
      text: 'Basic Pixi.js Game',
      style: new TextStyle({
        fontFamily: 'Arial',
        fontSize: 32,
        fill: 0xffffff,
        align: 'center',
      }),
    })

    this.instructionText = new Text({
      text: 'Use WASD or Arrow Keys to move',
      style: new TextStyle({
        fontFamily: 'Arial',
        fontSize: 16,
        fill: 0xcccccc,
        align: 'center',
      }),
    })
  }

  init(): void {
    // Position title text
    this.titleText.x = 400 - this.titleText.width / 2
    this.titleText.y = 50

    // Position instruction text
    this.instructionText.x = 400 - this.instructionText.width / 2
    this.instructionText.y = 100

    // Position player in center
    this.player.x = 400
    this.player.y = 300

    // Add objects to scene
    this.addChild(this.titleText)
    this.addChild(this.instructionText)
    this.addChild(this.player)

    // Initialize player
    this.player.init()
  }

  update(deltaTime: number): void {
    // Update game objects
    this.player.update(deltaTime)

    // Keep player within screen bounds
    if (this.player.x < 25) this.player.x = 25
    if (this.player.x > 775) this.player.x = 775
    if (this.player.y < 25) this.player.y = 25
    if (this.player.y > 575) this.player.y = 575
  }
}