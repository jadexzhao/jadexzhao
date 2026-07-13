import { useState, useRef, useEffect } from 'react'
import './App.css'

interface Duck {
  id: number
  x: number
  y: number
  angle: number
  vx: number
  vy: number
  accessory?: string
}

const ACCESSORIES = ['💼', '🍵', '👷‍♀️'];
const getRandomAccessory = () => Math.random() > 0.7 ? ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)] : undefined;

export default function App() {
  const [ducks, setDucks] = useState<Duck[]>([
    { id: 1, x: 20, y: 60, angle: 0, vx: 1, vy: 0, accessory: getRandomAccessory() },
    { id: 2, x: 70, y: 70, angle: 180, vx: -0.8, vy: 0, accessory: getRandomAccessory() },
  ])
  const [nextId, setNextId] = useState(3)
  const canvasRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const [isDay, setIsDay] = useState(true)

  useEffect(() => {
    const checkTime = () => {
      const hours = new Date().getHours()
      setIsDay(hours >= 6 && hours < 18)
    }
    checkTime()
    const interval = setInterval(checkTime, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ]
    let konamiIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
          setNextId(prevId => {
            setDucks(prevDucks => {
              const newDucks: Duck[] = []
              for (let i = 0; i < 50; i++) {
                newDucks.push({
                  id: prevId + i,
                  x: Math.random() * 80 + 10,
                  y: 65 + Math.random() * 15,
                  angle: Math.random() > 0.5 ? 0 : 180,
                  vx: (Math.random() - 0.5) * 4,
                  vy: -Math.random() * 2,
                  accessory: getRandomAccessory()
                })
              }
              return [...prevDucks, ...newDucks]
            })
            return prevId + 50
          })
          konamiIndex = 0
        }
      } else {
        konamiIndex = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Animate ducks moving
  useEffect(() => {
    const animate = () => {
      setDucks(prevDucks =>
        prevDucks.map(duck => {
          let newVy = duck.vy
          if (duck.y < 65) {
            newVy += 0.05 // gravity
          }

          let newX = duck.x + duck.vx
          let newY = duck.y + newVy + (duck.x > 50 ? 0 : Math.sin(Date.now() * 0.003 + duck.id) * 0.1)
          let newAngle = duck.angle

          // Bounce off walls
          if (newX < 0 || newX > 90) {
            newAngle = newAngle === 0 ? 180 : 0
            newX = newX < 0 ? 0 : 90
          }

          // Keep in lower half (grass/pond area)
          if (newY >= 65) {
            newY = 65
            newVy = 0
          }

          return {
            ...duck,
            x: newX,
            y: newY,
            angle: newAngle,
            vx: duck.vx * (newAngle === 180 ? -1 : 1),
            vy: newVy,
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

    // Only place ducks in the grass/pond area (bottom 40%)
    if (y > 60) {
      const newDuck: Duck = {
        id: nextId,
        x,
        y,
        angle: Math.random() > 0.5 ? 0 : 180,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        accessory: getRandomAccessory()
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
      { id: 1, x: 20, y: 60, angle: 0, vx: 1, vy: 0, accessory: getRandomAccessory() },
      { id: 2, x: 70, y: 70, angle: 180, vx: -0.8, vy: 0, accessory: getRandomAccessory() },
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
        accessory: getRandomAccessory()
      })
    }
    setDucks([...ducks, ...newDucks])
    setNextId(nextId + 8)
  }

  return (
    <div className="farm-container">
      <header className="farm-header">
        <h1 className="farm-title">virtual duck farm</h1>
        <p className="farm-subtitle">鸭年 2026 · building toward something real</p>
      </header>

      <div
        ref={canvasRef}
        className={`farm-canvas ${isDay ? 'day' : 'night'}`}
        onClick={handleCanvasClick}
      >
        {!isDay && <div className="stars" />}
        <div className="cloud cloud-a" aria-hidden="true" />
        <div className="cloud cloud-b" aria-hidden="true" />
        <div className="cloud cloud-c" aria-hidden="true" />
        <div className="grass" />
        <div className="pond" />
        {ducks.map(duck => (
          <div
            key={duck.id}
            className="duck"
            style={{
              left: `${duck.x}%`,
              top: `${duck.y}%`,
              transform: `${duck.angle === 180 ? 'scaleX(-1)' : ''} ${duck.x > 50 ? '' : `translateY(${Math.sin(Date.now() * 0.003) * 2}px)`}`,
            }}
            onClick={(e) => handleDuckClick(e, duck.id)}
          >
            🦆
            {duck.accessory && <span className="accessory">{duck.accessory}</span>}
          </div>
        ))}
      </div>

      <div className="farm-hud">
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
          restaurant-kid wiring: what works vs talk. this is the placeholder — spoiler: this eats.
          <br />
          <em>↑↑↓↓←→←→ba</em> for a stampede. if you know, you know.
        </div>

        <p className="farm-links">
          <a href="https://jadexzhao.github.io/jadexzhao/">← portfolio</a>
          {' · '}
          <a href="https://github.com/jadexzhao">github</a>
          {' · '}
          <a href="https://github.com/matchaxmoxie">@matchaxmoxie</a>
        </p>
      </div>
    </div>
  )
}
