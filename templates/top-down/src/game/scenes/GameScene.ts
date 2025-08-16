import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { Player } from '../objects/Player'

export class GameScene extends Container {
  private player: Player
  private titleText: Text
  private instructionText: Text
  private obstacles: Graphics[] = []
  private bounds: Graphics

  constructor() {
    super()
    
    // Create game objects
    this.player = new Player()
    this.bounds = new Graphics()
    
    // Create UI text
    this.titleText = new Text({
      text: 'Top-Down Game',
      style: new TextStyle({
        fontFamily: 'Arial',
        fontSize: 32,
        fill: 0xffffff,
        align: 'center',
      }),
    })

    this.instructionText = new Text({
      text: 'Use WASD or Arrow Keys to move and navigate around obstacles',
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
    this.titleText.y = 20

    // Position instruction text
    this.instructionText.x = 400 - this.instructionText.width / 2
    this.instructionText.y = 60

    // Create play area bounds
    this.bounds.rect(50, 100, 700, 450)
    this.bounds.stroke({ width: 3, color: 0x555555 })

    // Create obstacles
    this.createObstacles()

    // Position player in the play area
    this.player.x = 100
    this.player.y = 150

    // Add objects to scene
    this.addChild(this.bounds)
    this.obstacles.forEach(obstacle => this.addChild(obstacle))
    this.addChild(this.titleText)
    this.addChild(this.instructionText)
    this.addChild(this.player)

    // Initialize player
    this.player.init()
  }

  private createObstacles(): void {
    const obstacleData = [
      { x: 200, y: 200, width: 60, height: 80, color: 0x8B4513 }, // Brown
      { x: 400, y: 150, width: 40, height: 40, color: 0x696969 }, // Gray
      { x: 600, y: 250, width: 80, height: 60, color: 0x8B4513 },
      { x: 150, y: 400, width: 100, height: 50, color: 0x556B2F }, // Dark green
      { x: 500, y: 380, width: 70, height: 70, color: 0x696969 },
      { x: 300, y: 320, width: 50, height: 120, color: 0x556B2F },
      { x: 650, y: 450, width: 90, height: 40, color: 0x8B4513 },
    ]

    for (const data of obstacleData) {
      const obstacle = new Graphics()
      obstacle.rect(data.x, data.y, data.width, data.height)
      obstacle.fill(data.color)
      obstacle.stroke({ width: 2, color: data.color - 0x222222 })
      this.obstacles.push(obstacle)
    }
  }

  update(deltaTime: number): void {
    // Update game objects
    this.player.update(deltaTime)

    // Keep player within play area bounds
    if (this.player.x < 70) this.player.x = 70
    if (this.player.x > 730) this.player.x = 730
    if (this.player.y < 120) this.player.y = 120
    if (this.player.y > 530) this.player.y = 530

    // Simple collision detection with obstacles
    this.checkObstacleCollisions()
  }

  private checkObstacleCollisions(): void {
    const playerBounds = {
      x: this.player.x - 15,
      y: this.player.y - 15,
      width: 30,
      height: 30
    }

    for (const obstacle of this.obstacles) {
      const obstacleBounds = obstacle.getBounds()
      
      if (this.isColliding(playerBounds, obstacleBounds)) {
        // Simple collision response - push player back
        const centerX = playerBounds.x + playerBounds.width / 2
        const centerY = playerBounds.y + playerBounds.height / 2
        const obstacleX = obstacleBounds.x + obstacleBounds.width / 2
        const obstacleY = obstacleBounds.y + obstacleBounds.height / 2
        
        const dx = centerX - obstacleX
        const dy = centerY - obstacleY
        
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal collision
          this.player.x = dx > 0 ? obstacleBounds.x + obstacleBounds.width + 15 : obstacleBounds.x - 15
        } else {
          // Vertical collision
          this.player.y = dy > 0 ? obstacleBounds.y + obstacleBounds.height + 15 : obstacleBounds.y - 15
        }
      }
    }
  }

  private isColliding(rect1: any, rect2: any): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y
  }
}