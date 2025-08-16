import { Container, Graphics } from 'pixi.js'
import { InputManager } from '../../utils/InputManager'

export class Player extends Container {
  private graphics: Graphics
  private inputManager: InputManager
  private speed = 180 // pixels per second
  private velocity = { x: 0, y: 0 }
  private rotation_speed = 0.1
  private currentDirection = 0 // in radians

  constructor() {
    super()
    
    this.graphics = new Graphics()
    this.inputManager = new InputManager()
  }

  init(): void {
    // Draw a triangle pointing up for directional movement
    this.graphics.moveTo(0, -20)
    this.graphics.lineTo(-12, 12)
    this.graphics.lineTo(12, 12)
    this.graphics.lineTo(0, -20)
    this.graphics.fill(0xff4444) // Red triangle
    this.graphics.stroke({ width: 2, color: 0xcc2222 })

    // Add a small circle at the center
    this.graphics.circle(0, 0, 3)
    this.graphics.fill(0xffffff)

    this.addChild(this.graphics)
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 60 // Convert from 60fps delta to seconds

    // Calculate movement based on input
    this.velocity.x = 0
    this.velocity.y = 0

    // 8-directional movement
    if (this.inputManager.isKeyPressed('KeyW') || this.inputManager.isKeyPressed('ArrowUp')) {
      this.velocity.y = -this.speed
    }
    if (this.inputManager.isKeyPressed('KeyS') || this.inputManager.isKeyPressed('ArrowDown')) {
      this.velocity.y = this.speed
    }
    if (this.inputManager.isKeyPressed('KeyA') || this.inputManager.isKeyPressed('ArrowLeft')) {
      this.velocity.x = -this.speed
    }
    if (this.inputManager.isKeyPressed('KeyD') || this.inputManager.isKeyPressed('ArrowRight')) {
      this.velocity.x = this.speed
    }

    // Normalize diagonal movement
    if (this.velocity.x !== 0 && this.velocity.y !== 0) {
      this.velocity.x *= 0.707 // 1/sqrt(2)
      this.velocity.y *= 0.707
    }

    // Rotate player to face movement direction
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      const targetDirection = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2
      let angleDiff = targetDirection - this.currentDirection

      // Normalize angle difference to [-PI, PI]
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI

      // Smooth rotation
      if (Math.abs(angleDiff) > this.rotation_speed) {
        this.currentDirection += Math.sign(angleDiff) * this.rotation_speed
      } else {
        this.currentDirection = targetDirection
      }

      this.rotation = this.currentDirection
    }

    // Apply movement
    this.x += this.velocity.x * dt
    this.y += this.velocity.y * dt
  }
}