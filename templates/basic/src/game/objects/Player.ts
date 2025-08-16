import { Container, Graphics } from 'pixi.js'
import { InputManager } from '../../utils/InputManager'

export class Player extends Container {
  private graphics: Graphics
  private inputManager: InputManager
  private speed = 200 // pixels per second
  private velocity = { x: 0, y: 0 }

  constructor() {
    super()
    
    this.graphics = new Graphics()
    this.inputManager = new InputManager()
  }

  init(): void {
    // Draw a simple square for the player
    this.graphics.rect(-25, -25, 50, 50)
    this.graphics.fill(0x00ff00) // Green square
    this.graphics.stroke({ width: 2, color: 0x00aa00 })

    this.addChild(this.graphics)
  }

  update(deltaTime: number): void {
    // Calculate movement based on input
    this.velocity.x = 0
    this.velocity.y = 0

    if (this.inputManager.isKeyPressed('KeyA') || this.inputManager.isKeyPressed('ArrowLeft')) {
      this.velocity.x = -this.speed
    }
    if (this.inputManager.isKeyPressed('KeyD') || this.inputManager.isKeyPressed('ArrowRight')) {
      this.velocity.x = this.speed
    }
    if (this.inputManager.isKeyPressed('KeyW') || this.inputManager.isKeyPressed('ArrowUp')) {
      this.velocity.y = -this.speed
    }
    if (this.inputManager.isKeyPressed('KeyS') || this.inputManager.isKeyPressed('ArrowDown')) {
      this.velocity.y = this.speed
    }

    // Normalize diagonal movement
    if (this.velocity.x !== 0 && this.velocity.y !== 0) {
      this.velocity.x *= 0.707 // 1/sqrt(2)
      this.velocity.y *= 0.707
    }

    // Apply movement (deltaTime is in milliseconds, convert to seconds)
    const dt = deltaTime / 60 // Convert from 60fps delta to seconds
    this.x += this.velocity.x * dt
    this.y += this.velocity.y * dt
  }
}