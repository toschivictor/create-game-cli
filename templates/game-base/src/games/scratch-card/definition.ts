import type { GameDefinition } from '@/games/types'
import { SceneRouter } from '@/core/router/SceneRouter'
import { LoadingScene } from '@/games/scratch-card/scenes/LoadingScene'
import { MenuScene } from '@/games/scratch-card/scenes/MenuScene'
import { GameScene } from '@/games/scratch-card/scenes/GameScene'
import { ResultScene } from '@/games/scratch-card/scenes/ResultScene'

export const scratchCardGame: GameDefinition = {
  id: 'scratch-card',
  displayName: 'Scratch Card',
  initialScene: 'loading',
  registerScenes(router: SceneRouter) {
    router.registerScene('loading', new LoadingScene())
    router.registerScene('menu', new MenuScene(router))
    router.registerScene('game', new GameScene(router))
    router.registerScene('result', new ResultScene(router))
  },
  registerDomain() {
    // Attach slices/services if needed
  },
}
