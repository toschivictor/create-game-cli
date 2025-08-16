import { GameManager } from '@/core/managers/GameManager'
import { SCENES } from '@/shared/constants'

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const gameContainer = document.getElementById('game-container')
  
  if (!gameContainer) {
    console.error('Game container not found!')
    return
  }

  try {
    // Create and initialize the game
    const gameManager = new GameManager(gameContainer)
    await gameManager.initialize()

    // Listen for loading completion to transition to menu
    window.addEventListener('loadingComplete', async () => {
      setTimeout(async () => {
        await gameManager.navigateToScene(SCENES.MENU)
      }, 1000) // Small delay before transitioning
    })

    console.log('Scratch Card Game started successfully!')
  } catch (error) {
    console.error('Failed to start game:', error)
    
    // Show error message to user
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
      background: rgba(0, 0, 0, 0.8);
      padding: 20px;
      border-radius: 8px;
    `
    errorDiv.innerHTML = `
      <h2>Failed to load game</h2>
      <p>Please refresh the page to try again.</p>
    `
    gameContainer.appendChild(errorDiv)
  }
})