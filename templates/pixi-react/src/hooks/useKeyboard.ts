import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import type { Bullet } from '@/types'

export const useKeyboard = () => {
  const keysRef = useRef<Set<string>>(new Set())
  const lastShotTimeRef = useRef<number>(0)
  const shootCooldown = 200 // ms

  const {
    gameStarted,
    gamePaused,
    gameOver,
    player,
    updatePlayer,
    addBullet,
  } = useGameStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current.add(event.code)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.code)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!gameStarted || gamePaused || gameOver) return

    const handleMovement = () => {
      let newX = player.x
      let newY = player.y
      const speed = player.speed / 60 // Assuming 60 FPS

      // Movement
      if (keysRef.current.has('KeyW') || keysRef.current.has('ArrowUp')) {
        newY = Math.max(player.height / 2, newY - speed)
      }
      if (keysRef.current.has('KeyS') || keysRef.current.has('ArrowDown')) {
        newY = Math.min(600 - player.height / 2, newY + speed)
      }
      if (keysRef.current.has('KeyA') || keysRef.current.has('ArrowLeft')) {
        newX = Math.max(player.width / 2, newX - speed)
      }
      if (keysRef.current.has('KeyD') || keysRef.current.has('ArrowRight')) {
        newX = Math.min(800 - player.width / 2, newX + speed)
      }

      // Shooting
      if (keysRef.current.has('Space')) {
        const now = Date.now()
        if (now - lastShotTimeRef.current > shootCooldown) {
          const bullet: Bullet = {
            id: now.toString(),
            x: newX,
            y: newY - player.height / 2,
            velocity: { x: 0, y: -400 },
            width: 4,
            height: 8,
            color: 0xffff00,
            damage: 1,
          }
          addBullet(bullet)
          lastShotTimeRef.current = now
        }
      }

      if (newX !== player.x || newY !== player.y) {
        updatePlayer({ x: newX, y: newY })
      }
    }

    const intervalId = setInterval(handleMovement, 16) // ~60 FPS

    return () => clearInterval(intervalId)
  }, [gameStarted, gamePaused, gameOver, player, updatePlayer, addBullet])

  return null
}