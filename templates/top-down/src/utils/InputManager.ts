export class InputManager {
  private static instance: InputManager
  private pressedKeys: Set<string> = new Set()

  constructor() {
    if (InputManager.instance) {
      return InputManager.instance
    }

    InputManager.instance = this
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (event) => {
      this.pressedKeys.add(event.code)
    })

    window.addEventListener('keyup', (event) => {
      this.pressedKeys.delete(event.code)
    })

    // Clear keys when window loses focus
    window.addEventListener('blur', () => {
      this.pressedKeys.clear()
    })
  }

  isKeyPressed(keyCode: string): boolean {
    return this.pressedKeys.has(keyCode)
  }

  getActiveTouchId() {
    // For future mobile support
    return null
  }
}