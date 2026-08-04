import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { AnimatedCounter } from './AnimatedCounter'

interface Crumb {
  id: number
  x: number
  y: number
  speed: number
}

export function BreadcrumbGame() {
  const reduced = useReducedMotion()
  const [score, setScore] = useState(0)
  const [crumbs, setCrumbs] = useState<Crumb[]>([])
  const [playing, setPlaying] = useState(false)
  const [missed, setMissed] = useState(0)
  const idRef = useRef(0)

  const spawnCrumb = useCallback(() => {
    idRef.current += 1
    setCrumbs((prev) => [
      ...prev,
      {
        id: idRef.current,
        x: 10 + Math.random() * 80,
        y: -8,
        speed: 1.2 + Math.random() * 1.8,
      },
    ])
  }, [])

  useEffect(() => {
    if (!playing || reduced) return

    const spawnInterval = window.setInterval(spawnCrumb, 900)
    let frame: number

    const tick = () => {
      setCrumbs((prev) =>
        prev
          .map((c) => ({ ...c, y: c.y + c.speed }))
          .filter((c) => {
            if (c.y > 105) {
              setMissed((m) => m + 1)
              return false
            }
            return true
          }),
      )
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      window.clearInterval(spawnInterval)
      cancelAnimationFrame(frame)
    }
  }, [playing, reduced, spawnCrumb])

  useEffect(() => {
    if (missed >= 5) setPlaying(false)
  }, [missed])

  const catchCrumb = (id: number) => {
    setCrumbs((prev) => prev.filter((c) => c.id !== id))
    setScore((s) => s + 1)
  }

  const startGame = () => {
    setScore(0)
    setMissed(0)
    setCrumbs([])
    setPlaying(true)
  }

  return (
    <section className="breadcrumb-game" aria-label="Catch breadcrumbs mini-game">
      <div className="breadcrumb-game__header">
        <h2>Catch crumbs!</h2>
        <span className="breadcrumb-game__score">
          Score: <AnimatedCounter value={score} />
        </span>
      </div>

      <div className="breadcrumb-game__pond" role="group" aria-label="Tap falling breadcrumbs">
        {!playing && (
          <div className="breadcrumb-game__overlay">
            <p>{missed >= 5 ? '5 missed ... game over!' : 'Tap crumbs before they sink!'}</p>
            <button type="button" className="quack-btn quack-btn--primary" onClick={startGame}>
              {missed >= 5 || score > 0 ? 'Play again' : 'Start'}
            </button>
          </div>
        )}
        {crumbs.map((c) => (
          <button
            key={c.id}
            type="button"
            className="breadcrumb-game__crumb"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
            onClick={() => catchCrumb(c.id)}
            aria-label="Catch breadcrumb"
          >
            🍞
          </button>
        ))}
        <span className="breadcrumb-game__duck" aria-hidden="true">
          🦆
        </span>
      </div>
    </section>
  )
}
