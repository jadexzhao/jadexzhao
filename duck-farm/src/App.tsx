import { useState, useRef, useEffect } from 'react'
import './App.css'

interface Duck {
  id: number
  x: number
  y: number
  angle: number
  vx: number
  vy: number
}

export default function App() {
  const [ducks, setDucks] = useState<Duck[]>([
    { id: 1, x: 20, y: 60, angle: 0, vx: 1, vy: 0 },
    { id: 2, x: 70, y: 70, angle: 180, vx: -0.8, vy: 0 },
  ])
  const [nextId, setNextId] = useState(3)
  const canvasRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Animate ducks moving
  useEffect(() => {
    const animate = () => {
      setDucks(prevDucks =>
        prevDucks.map(duck => {
          let newX = duck.x + duck.vx
          let newY = duck.y + duck.vy + (Math.sin(Date.now() * 0.003 + duck.id) * 0.1)
          let newAngle = duck.angle

          // Bounce off walls
          if (newX < 0 || newX > 90) {
            newAngle = newAngle === 0 ? 180 : 0
            newX = newX < 0 ? 0 : 90
          }

          // Keep in lower half (grass area)
          if (newY > 65) newY = 65

          return {
            ...duck,
            x: newX,
            y: newY,
            angle: newAngle,
            vx: duck.vx * (newAngle === 180 ? -1 : 1),
          }
        })
      )
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current!)
  }, [])

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Only place ducks in the grass area (bottom 40%)
    if (y > 60) {
      const newDuck: Duck = {
        id: nextId,
        x,
        y,
        angle: Math.random() > 0.5 ? 0 : 180,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
      }
      setDucks([...ducks, newDuck])
      setNextId(nextId + 1)
    }
  }

  const handleDuckClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    
    // Make the duck quack
    const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==')
    audio.play().catch(() => {}) // Quack sound attempt

    // Add a temporary visual effect
    setDucks(prevDucks =>
      prevDucks.map(d =>
        d.id === id ? { ...d, vx: d.vx * -1, vy: -0.5 } : d
      )
    )
  }

  const clearFarm = () => {
    setDucks([])
    setNextId(1)
  }

  const resetFarm = () => {
    setDucks([
      { id: 1, x: 20, y: 60, angle: 0, vx: 1, vy: 0 },
      { id: 2, x: 70, y: 70, angle: 180, vx: -0.8, vy: 0 },
    ])
    setNextId(3)
  }

  const populateFarm = () => {
    const newDucks: Duck[] = []
    for (let i = 0; i < 8; i++) {
      newDucks.push({
        id: nextId + i,
        x: Math.random() * 80 + 10,
        y: 65 + Math.random() * 15,
        angle: Math.random() > 0.5 ? 0 : 180,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
      })
    }
    setDucks([...ducks, ...newDucks])
    setNextId(nextId + 8)
  }

  return (
    <div className="farm-container">
      <h1 className="farm-title">virtual duck farm</h1>
      <p className="farm-subtitle">building toward something real</p>

      <div
        ref={canvasRef}
        className="farm-canvas"
        onClick={handleCanvasClick}
      >
        <div className="grass" />
        {ducks.map(duck => (
          <div
            key={duck.id}
            className="duck"
            style={{
              left: `${duck.x}%`,
              top: `${duck.y}%`,
              transform: `${duck.angle === 180 ? 'scaleX(-1)' : ''} translateY(${Math.sin(Date.now() * 0.003) * 2}px)`,
            }}
            onClick={(e) => handleDuckClick(e, duck.id)}
          >
            🦆
          </div>
        ))}
      </div>

      <div className="counter">
        <span>{ducks.length}</span> duck{ducks.length !== 1 ? 's' : ''} on the farm
      </div>

      <div className="controls">
        <button onClick={populateFarm}>spawn 8 ducks</button>
        <button onClick={resetFarm}>reset</button>
        <button onClick={clearFarm}>clear all</button>
      </div>

      <div className="info">
        <strong>click on the grass</strong> to place ducks. <strong>click a duck</strong> to make it jump.
        <br />
        watch them waddle around. this is the placeholder version of the real thing.
      </div>

      <p className="farm-links">
        <a href="https://jadexzhao.github.io/jadexzhao/">← portfolio</a>
        {' · '}
        <a href="https://github.com/jadexzhao">github</a>
        {' · '}
        <a href="https://github.com/matchaxmoxie">@matchaxmoxie</a>
      </p>
    </div>
  )
}
