import React from 'react'
import { useGameStore } from '@/store/gameStore'
import type { SceneName } from '@/types'

interface UIProps {
  currentScene: SceneName
}

export const UI: React.FC<UIProps> = ({ currentScene }) => {
  const {
    score,
    lives,
    level,
    gameStarted,
    gamePaused,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
  } = useGameStore()

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#4f46e5',
    color: 'white',
    margin: '8px',
    transition: 'background-color 0.2s',
  }

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    pointerEvents: 'none',
  }

  const hudStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '800px',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
  }

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    pointerEvents: 'auto',
  }

  return (
    <div style={containerStyle}>
      {/* HUD */}
      {currentScene === 'game' && (
        <div style={hudStyle}>
          <div>Score: {score}</div>
          <div>Lives: {lives}</div>
          <div>Level: {level}</div>
        </div>
      )}

      {/* Controls */}
      <div style={controlsStyle}>
        {currentScene === 'menu' && (
          <button
            style={buttonStyle}
            onClick={startGame}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3730a3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5'
            }}
          >
            Start Game
          </button>
        )}

        {currentScene === 'game' && (
          <button
            style={buttonStyle}
            onClick={gamePaused ? resumeGame : pauseGame}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3730a3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5'
            }}
          >
            {gamePaused ? 'Resume' : 'Pause'}
          </button>
        )}

        {currentScene === 'gameOver' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={buttonStyle}
              onClick={restartGame}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3730a3'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4f46e5'
              }}
            >
              Play Again
            </button>
            <button
              style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
              onClick={() => useGameStore.getState().setCurrentScene('menu')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6b7280'
              }}
            >
              Main Menu
            </button>
          </div>
        )}

        {gamePaused && currentScene === 'game' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
          }}>
            PAUSED
          </div>
        )}
      </div>
    </div>
  )
}