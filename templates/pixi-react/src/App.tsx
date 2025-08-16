import React from 'react'
import { GameContainer } from '@/components/GameContainer'
import { UI } from '@/components/UI'
import { useGameStore } from '@/store/gameStore'

function App() {
  const currentScene = useGameStore((state) => state.currentScene)

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      <GameContainer />
      <UI currentScene={currentScene} />
    </div>
  )
}

export default App