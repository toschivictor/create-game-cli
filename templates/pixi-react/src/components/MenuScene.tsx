import React from 'react'
import { Container, Text } from '@pixi/react'
import { TextStyle } from 'pixi.js'

export const MenuScene: React.FC = () => {
  const titleStyle = new TextStyle({
    fontFamily: 'Arial, sans-serif',
    fontSize: 48,
    fill: 0xffffff,
    align: 'center',
    fontWeight: 'bold',
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
        text="Pixi + React Game"
        anchor={0.5}
        x={400}
        y={200}
        style={titleStyle}
      />
      <Text
        text="Use the React UI below to start the game!"
        anchor={0.5}
        x={400}
        y={300}
        style={instructionStyle}
      />
      <Text
        text="WASD or Arrow Keys to move • Space to shoot"
        anchor={0.5}
        x={400}
        y={350}
        style={instructionStyle}
      />
    </Container>
  )
}