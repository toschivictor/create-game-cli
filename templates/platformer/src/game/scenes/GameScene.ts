import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { Player } from '../objects/Player'

export class GameScene extends Container {
  private player: Player
  private titleText: Text
  private instructionText: Text
  private ground: Graphics
  private platforms: Graphics[] = []

  constructor() {
    super()
    
    // Create game objects
    this.player = new Player()
    this.ground = new Graphics()
    
    // Create UI text
    this.titleText = new Text({
      text: 'Platformer Game',
      style: new TextStyle({
        fontFamily: 'Arial',
        fontSize: 32,
        fill: 0xffffff,
        align: 'center',
      }),
    })

    this.instructionText = new Text({
      text: 'Use A/D or Arrow Keys to move, W/Up/Space to jump',
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
    this.titleText.y = 30

    // Position instruction text
    this.instructionText.x = 400 - this.instructionText.width / 2
    this.instructionText.y = 70

    // Create ground
    this.ground.rect(0, 565, 800, 35)
    this.ground.fill(0x8B4513) // Brown ground
    this.ground.stroke({ width: 2, color: 0x654321 })

    // Create platforms
    this.createPlatforms()

    // Position player on ground
    this.player.x = 100
    this.player.y = 550

    // Add objects to scene
    this.addChild(this.ground)
    this.platforms.forEach(platform => this.addChild(platform))
    this.addChild(this.titleText)
    this.addChild(this.instructionText)
    this.addChild(this.player)

    // Initialize player
    this.player.init()
  }

  private createPlatforms(): void {
    const platformData = [
      { x: 200, y: 450, width: 100, height: 20 },
      { x: 400, y: 350, width: 100, height: 20 },
      { x: 600, y: 250, width: 100, height: 20 },
      { x: 150, y: 200, width: 80, height: 20 },
      { x: 550, y: 150, width: 120, height: 20 },
    ]

    for (const data of platformData) {
      const platform = new Graphics()
      platform.rect(data.x, data.y, data.width, data.height)
      platform.fill(0x666666) // Gray platforms
      platform.stroke({ width: 2, color: 0x444444 })
      this.platforms.push(platform)
    }
  }

  update(deltaTime: number): void {
    // Update game objects
    this.player.update(deltaTime)

    // Keep player within screen bounds
    if (this.player.x < 15) this.player.x = 15
    if (this.player.x > 785) this.player.x = 785
  }
}