import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface AnimatedCounterProps {
  value: number
  format?: (n: number) => string
  className?: string
}

export function AnimatedCounter({ value, format, className }: AnimatedCounterProps) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(value)
  const [bump, setBump] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current === value) return
    prev.current = value

    if (reduced) {
      setDisplay(value)
      return
    }

    setBump(true)
    const start = display
    const diff = value - start
    const duration = 320
    const startTime = performance.now()

    let frame: number
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - (1 - t) ** 3
      setDisplay(Math.round(start + diff * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const bumpTimer = window.setTimeout(() => setBump(false), 400)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(bumpTimer)
    }
  }, [value, reduced, display])

  const text = format ? format(display) : String(display)

  return (
    <span className={`animated-counter${bump ? ' is-bumping' : ''}${className ? ` ${className}` : ''}`}>
      {text}
    </span>
  )
}
