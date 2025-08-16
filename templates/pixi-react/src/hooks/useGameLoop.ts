import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export const useGameLoop = () => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  const {
    gameStarted,
    gamePaused,
    gameOver,
    enemies,
    bullets,
    player,
    updateEnemy,
    updateBullet,
    removeEnemy,
    removeBullet,
    addScore,
    loseLife,
  } = useGameStore()

  const gameLoop = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000

      if (gameStarted && !gamePaused && !gameOver) {
        // Update enemies
        enemies.forEach((enemy) => {
          const newY = enemy.y + enemy.velocity.y * deltaTime
          
          if (newY > 600) {
            removeEnemy(enemy.id)
            loseLife()
          } else {
            updateEnemy(enemy.id, { y: newY })
            
            // Check collision with player
            if (
              enemy.x < player.x + player.width / 2 &&
              enemy.x + enemy.width > player.x - player.width / 2 &&
              enemy.y < player.y + player.height / 2 &&
              enemy.y + enemy.height > player.y - player.height / 2
            ) {
              removeEnemy(enemy.id)
              loseLife()
            }
          }
        })

        // Update bullets
        bullets.forEach((bullet) => {
          const newY = bullet.y + bullet.velocity.y * deltaTime
          
          if (newY < 0) {
            removeBullet(bullet.id)
          } else {
            updateBullet(bullet.id, { y: newY })
            
            // Check collision with enemies
            enemies.forEach((enemy) => {
              if (
                bullet.x < enemy.x + enemy.width / 2 &&
                bullet.x + bullet.width > enemy.x - enemy.width / 2 &&
                bullet.y < enemy.y + enemy.height / 2 &&
                bullet.y + bullet.height > enemy.y - enemy.height / 2
              ) {
                removeBullet(bullet.id)
                removeEnemy(enemy.id)
                addScore(10)
              }
            })
          }
        })
      }
    }

    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(gameLoop)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [gameStarted, gamePaused, gameOver, enemies, bullets, player])

  return null
}