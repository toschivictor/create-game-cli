import { Container, Graphics } from 'pixi.js'
import { InputManager } from '../../utils/InputManager'

export class Player extends Container {
  private graphics: Graphics
  private inputManager: InputManager
  private speed = 150 // horizontal movement speed
  private jumpPower = 300 // jump force
  private gravity = 800 // gravity force
  private velocity = { x: 0, y: 0 }
  private isOnGround = false
  private groundY = 550 // ground level

  constructor() {
    super()
    
    this.graphics = new Graphics()
    this.inputManager = new InputManager()
  }

  init(): void {
    // Draw a simple rectangle for the player
    this.graphics.rect(-15, -30, 30, 30)
    this.graphics.fill(0x0088ff) // Blue rectangle
    this.graphics.stroke({ width: 2, color: 0x0066cc })

    this.addChild(this.graphics)
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 60 // Convert from 60fps delta to seconds

    // Horizontal movement
    this.velocity.x = 0
    if (this.inputManager.isKeyPressed('KeyA') || this.inputManager.isKeyPressed('ArrowLeft')) {
      this.velocity.x = -this.speed
    }
    if (this.inputManager.isKeyPressed('KeyD') || this.inputManager.isKeyPressed('ArrowRight')) {
      this.velocity.x = this.speed
    }

    // Jumping
    if ((this.inputManager.isKeyPressed('KeyW') || this.inputManager.isKeyPressed('ArrowUp') || this.inputManager.isKeyPressed('Space')) && this.isOnGround) {
      this.velocity.y = -this.jumpPower
      this.isOnGround = false
    }

    // Apply gravity
    this.velocity.y += this.gravity * dt

    // Apply movement
    this.x += this.velocity.x * dt
    this.y += this.velocity.y * dt

    // Ground collision
    if (this.y >= this.groundY) {
      this.y = this.groundY
      this.velocity.y = 0
      this.isOnGround = true
    }

    // Keep player within horizontal screen bounds
    if (this.x < 15) this.x = 15
    if (this.x > 785) this.x = 785
  }
}