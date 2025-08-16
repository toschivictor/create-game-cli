import React from 'react'
import { Container, Text } from '@pixi/react'
import { TextStyle } from 'pixi.js'
import { useGameStore } from '@/store/gameStore'

export const GameOverScene: React.FC = () => {
  const score = useGameStore((state) => state.score)

  const gameOverStyle = new TextStyle({
    fontFamily: 'Arial, sans-serif',
    fontSize: 48,
    fill: 0xff4444,
    align: 'center',
    fontWeight: 'bold',
  })

  const scoreStyle = new TextStyle({
    fontFamily: 'Arial, sans-serif',
    fontSize: 24,
    fill: 0xffffff,
    align: 'center',
  })

  const instructionStyle = new TextStyle({
    fontFamily: 'Arial, sans-serif',
    fontSize: 18,
    fill: 0xcccccc,
    align: 'center',
  })

  return (
    <Container>
      <Text
        text="GAME OVER"
        anchor={0.5}
        x={400}
        y={200}
        style={gameOverStyle}
      />
      <Text
        text={`Final Score: ${score}`}
        anchor={0.5}
        x={400}
        y={280}
        style={scoreStyle}
      />
      <Text
        text="Use the React UI below to play again!"
        anchor={0.5}
        x={400}
        y={350}
        style={instructionStyle}
      />
    </Container>
  )
}