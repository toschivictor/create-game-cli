import { Container, Graphics, Text, TextStyle, FederatedPointerEvent } from 'pixi.js'
import { gsap } from 'gsap'
import { COLORS } from '@/shared/constants'

interface ButtonStyle {
  backgroundColor?: number
  textColor?: number
  fontSize?: number
  borderRadius?: number
  borderColor?: number
  borderWidth?: number
}

interface ButtonOptions {
  text: string
  width: number
  height: number
  style?: ButtonStyle
  onClick?: () => void
  enabled?: boolean
}

export class Button extends Container {
  private background: Graphics
  private textElement: Text
  private options: ButtonOptions
  private isEnabled: boolean = true
  private isHovered: boolean = false
  private isPressed: boolean = false

  constructor(options: ButtonOptions) {
    super()
    
    this.options = {
      enabled: true,
      ...options,
      style: {
        backgroundColor: COLORS.PRIMARY,
        textColor: COLORS.WHITE,
        fontSize: 16,
        borderRadius: 8,
        borderColor: COLORS.PRIMARY,
        borderWidth: 0,
        ...options.style,
      },
    }

    this.isEnabled = this.options.enabled ?? true
    
    this.background = new Graphics()
    this.textElement = new Text({
      text: this.options.text,
      style: new TextStyle({
        fontFamily: 'Arial, sans-serif',
        fontSize: this.options.style!.fontSize,
        fill: this.options.style!.textColor,
        align: 'center',
        fontWeight: 'bold',
      }),
    })

    this.setupButton()
    this.setupInteractions()
  }

  private setupButton(): void {
    // Add background
    this.addChild(this.background)
    
    // Add text
    this.textElement.anchor.set(0.5)
    this.textElement.x = this.options.width / 2
    this.textElement.y = this.options.height / 2
    this.addChild(this.textElement)

    // Draw initial state
    this.drawButton()
  }

  private setupInteractions(): void {
    this.eventMode = 'static'
    this.cursor = 'pointer'

    this.on('pointerover', this.onPointerOver.bind(this))
    this.on('pointerout', this.onPointerOut.bind(this))
    this.on('pointerdown', this.onPointerDown.bind(this))
    this.on('pointerup', this.onPointerUp.bind(this))
    this.on('pointerupoutside', this.onPointerUpOutside.bind(this))
    this.on('click', this.onClick.bind(this))
  }

  private drawButton(): void {
    const style = this.options.style!
    
    this.background.clear()
    
    if (style.borderWidth && style.borderWidth > 0) {
      this.background.lineStyle(style.borderWidth, style.borderColor!)
    }

    // Determine background color based on state
    let backgroundColor = style.backgroundColor!
    
    if (!this.isEnabled) {
      backgroundColor = COLORS.GRAY
    } else if (this.isPressed) {
      backgroundColor = this.darkenColor(backgroundColor, 0.3)
    } else if (this.isHovered) {
      backgroundColor = this.darkenColor(backgroundColor, 0.1)
    }

    this.background.roundRect(0, 0, this.options.width, this.options.height, style.borderRadius!)
    this.background.fill(backgroundColor)
  }

  private darkenColor(color: number, amount: number): number {
    const r = (color >> 16) & 0xff
    const g = (color >> 8) & 0xff
    const b = color & 0xff
    
    const darkR = Math.max(0, r - r * amount)
    const darkG = Math.max(0, g - g * amount)
    const darkB = Math.max(0, b - b * amount)
    
    return (darkR << 16) | (darkG << 8) | darkB
  }

  private onPointerOver(event: FederatedPointerEvent): void {
    if (!this.isEnabled) return
    
    this.isHovered = true
    this.drawButton()
    
    // Hover animation
    gsap.to(this.scale, {
      x: 1.05,
      y: 1.05,
      duration: 0.2,
      ease: 'power2.out',
    })
  }

  private onPointerOut(event: FederatedPointerEvent): void {
    if (!this.isEnabled) return
    
    this.isHovered = false
    this.isPressed = false
    this.drawButton()
    
    // Return to normal scale
    gsap.to(this.scale, {
      x: 1,
      y: 1,
      duration: 0.2,
      ease: 'power2.out',
    })
  }

  private onPointerDown(event: FederatedPointerEvent): void {
    if (!this.isEnabled) return
    
    this.isPressed = true
    this.drawButton()
    
    // Press animation
    gsap.to(this.scale, {
      x: 0.95,
      y: 0.95,
      duration: 0.1,
      ease: 'power2.out',
    })
  }

  private onPointerUp(event: FederatedPointerEvent): void {
    if (!this.isEnabled) return
    
    this.isPressed = false
    this.drawButton()
    
    // Release animation
    gsap.to(this.scale, {
      x: this.isHovered ? 1.05 : 1,
      y: this.isHovered ? 1.05 : 1,
      duration: 0.1,
      ease: 'power2.out',
    })
  }

  private onPointerUpOutside(event: FederatedPointerEvent): void {
    this.isPressed = false
    this.drawButton()
    
    gsap.to(this.scale, {
      x: 1,
      y: 1,
      duration: 0.1,
      ease: 'power2.out',
    })
  }

  private onClick(event: FederatedPointerEvent): void {
    if (!this.isEnabled) return
    
    if (this.options.onClick) {
      this.options.onClick()
    }
  }

  /**
   * Set the button's enabled state
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    this.cursor = enabled ? 'pointer' : 'default'
    this.alpha = enabled ? 1 : 0.6
    this.drawButton()
  }

  /**
   * Update button text
   */
  setText(text: string): void {
    this.textElement.text = text
  }

  /**
   * Update button style
   */
  updateStyle(style: Partial<ButtonStyle>): void {
    this.options.style = { ...this.options.style, ...style }
    
    // Update text style
    this.textElement.style.fontSize = this.options.style!.fontSize!
    this.textElement.style.fill = this.options.style!.textColor!
    
    this.drawButton()
  }

  destroy(): void {
    gsap.killTweensOf(this.scale)
    super.destroy()
  }
}