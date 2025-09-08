import type { SceneRouter } from '@/core/router/SceneRouter'

export interface GameDefinition {
  id: string
  displayName: string
  initialScene: string
  registerScenes: (router: SceneRouter) => void
  registerDomain?: () => void
}
