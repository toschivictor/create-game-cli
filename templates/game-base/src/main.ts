import { GameApp } from '@/core/managers/GameApp'
import { scratchCardGame } from '@/games/scratch-card/definition'

const container = document.getElementById('app')!

const app = new GameApp(container, scratchCardGame)
app.initialize().catch(console.error)

// Hot Module Replacement safety
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    app.destroy()
  })
}
