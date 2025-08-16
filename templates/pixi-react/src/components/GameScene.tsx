import React, { useEffect } from 'react'
import { Container, Graphics } from '@pixi/react'
import { useGameStore } from '@/store/gameStore'
import { useGameLoop } from '@/hooks/useGameLoop'
import { useKeyboard } from '@/hooks/useKeyboard'
import type { Enemy, Bullet } from '@/types'

export const GameScene: React.FC = () => {
  const {
    player,
    enemies,
    bullets,
    updatePlayer,
    addEnemy,
    addBullet,
    removeEnemy,
    removeBullet,
    addScore,
    loseLife,
  } = useGameStore()

  // Game loop
  useGameLoop()
  
  // Keyboard input
  useKeyboard()

  // Generate enemies periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const enemy: Enemy = {
        id: Date.now().toString(),
        x: Math.random() * 760 + 20,
        y: -20,
        velocity: { x: 0, y: 50 + Math.random() * 50 },
        width: 30,
        height: 30,
        color: 0xff4444,
        health: 1,
      }
      addEnemy(enemy)
    }, 2000)

    return () => clearInterval(interval)
  }, [addEnemy])

  return (
    <Container>
      {/* Player */}
      <Graphics
        draw={(g) => {
          g.clear()
          g.rect(0, 0, player.width, player.height)
          g.fill(player.color)
        }}
        x={player.x - player.width / 2}
        y={player.y - player.height / 2}
      />

      {/* Enemies */}
      {enemies.map((enemy) => (
        <Graphics
          key={enemy.id}
          draw={(g) => {
            g.clear()
            g.rect(0, 0, enemy.width, enemy.height)
            g.fill(enemy.color)
          }}
          x={enemy.x - enemy.width / 2}
          y={enemy.y - enemy.height / 2}
        />
      ))}

      {/* Bullets */}
      {bullets.map((bullet) => (
        <Graphics
          key={bullet.id}
          draw={(g) => {
            g.clear()
            g.circle(0, 0, bullet.width / 2)
            g.fill(bullet.color)
          }}
          x={bullet.x}
          y={bullet.y}
        />
      ))}
    </Container>
  )
}