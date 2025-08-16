import React from 'react'
import { Stage, Container } from '@pixi/react'
import { useGameStore } from '@/store/gameStore'
import { GameScene } from './GameScene'
import { MenuScene } from './MenuScene'
import { GameOverScene } from './GameOverScene'

export const GameContainer: React.FC = () => {
  const currentScene = useGameStore((state) => state.currentScene)

  return (
    <Stage
      width={800}
      height={600}
      options={{
        backgroundColor: 0x1a1a2e,
        antialias: true,
      }}
      style={{
        display: 'block',
        margin: '0 auto',
        border: '2px solid #4f46e5',
        borderRadius: '8px',
      }}
    >
      <Container>
        {currentScene === 'menu' && <MenuScene />}
        {currentScene === 'game' && <GameScene />}
        {currentScene === 'gameOver' && <GameOverScene />}
      </Container>
    </Stage>
  )
}