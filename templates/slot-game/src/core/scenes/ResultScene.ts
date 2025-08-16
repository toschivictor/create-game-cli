import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import type { Scene, SceneData } from '@/shared/types'
import type { SceneRouter } from '@/core/router/SceneRouter'
import { GAME_CONFIG, COLORS, SCENES } from '@/shared/constants'
import { Button } from '@/ui/components/Button'

export class ResultScene extends Container implements Scene {
  name: string = SCENES.RESULT
  private router: SceneRouter
  private menuButton: Button

  constructor(router: SceneRouter) {
    super()
    this.router = router
    
    this.menuButton = new Button({
      text: 'Back to Menu',
      width: 160,
      height: 50,
      style: {
        backgroundColor: COLORS.PRIMARY,
        textColor: COLORS.WHITE,
        fontSize: 18,
      },
      onClick: () => this.goToMenu(),
    })
  }

  async init(): Promise<void> {
    // Simple result scene - just a back button for now
    this.menuButton.x = GAME_CONFIG.WIDTH / 2 - this.menuButton.width / 2
    this.menuButton.y = GAME_CONFIG.HEIGHT / 2

    this.addChild(this.menuButton)
  }

  private async goToMenu(): Promise<void> {
    await this.router.navigateTo(SCENES.MENU)
  }

  update(deltaTime: number): void {
    // No updates needed
  }

  destroy(): void {
    this.menuButton.destroy()
    super.destroy()
  }
}