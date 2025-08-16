import { Game } from './game/Game'

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('game-container')
  
  if (!gameContainer) {
    console.error('Game container not found!')
    return
  }

  // Create and start the game
  const game = new Game(gameContainer)
  game.start()
})