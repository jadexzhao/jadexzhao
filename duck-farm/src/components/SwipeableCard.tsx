import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type SwipeDirection = 'left' | 'right' | 'up' | null

interface SwipeableCardProps {
  children: ReactNode
  cardKey: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
}

const SWIPE_THRESHOLD = 80
const UP_THRESHOLD = 100

export function SwipeableCard({
  children,
  cardKey,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
}: SwipeableCardProps) {
  const reduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const draggingRef = useRef(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [exitDir, setExitDir] = useState<SwipeDirection>(null)

  draggingRef.current = dragging

  useEffect(() => {
    setOffset({ x: 0, y: 0 })
    setExitDir(null)
  }, [cardKey])

  const reset = () => {
    setOffset({ x: 0, y: 0 })
    setDragging(false)
    setExitDir(null)
  }

  const handleStart = (clientX: number, clientY: number) => {
    if (reduced || exitDir) return
    startRef.current = { x: clientX, y: clientY }
    setDragging(true)
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!startRef.current || reduced || exitDir) return
    const dx = clientX - startRef.current.x
    const dy = clientY - startRef.current.y
    setOffset({ x: dx, y: Math.min(0, dy) })
  }

  const handleEnd = () => {
    if (!startRef.current || reduced || exitDir) {
      reset()
      return
    }

    const { x, y } = offset

    if (y < -UP_THRESHOLD && onSwipeUp) {
      setExitDir('up')
      window.setTimeout(() => {
        onSwipeUp()
        reset()
      }, 280)
      return
    }

    if (x > SWIPE_THRESHOLD && onSwipeRight) {
      setExitDir('right')
      window.setTimeout(() => {
        onSwipeRight()
        reset()
      }, 280)
      return
    }

    if (x < -SWIPE_THRESHOLD && onSwipeLeft) {
      setExitDir('left')
      window.setTimeout(() => {
        onSwipeLeft()
        reset()
      }, 280)
      return
    }

    reset()
  }

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) handleStart(t.clientX, t.clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) handleMove(t.clientX, t.clientY)
    }
    const onTouchEnd = () => handleEnd()

    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY)
    const onMouseMove = (e: MouseEvent) => {
      if (draggingRef.current) handleMove(e.clientX, e.clientY)
    }
    const onMouseUp = () => handleEnd()

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [cardKey])

  const rotation = reduced ? 0 : offset.x * 0.06
  const opacity = exitDir ? 0 : 1
  const scale = exitDir === 'up' ? 1.08 : 1

  let transform = `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${scale})`
  if (exitDir === 'left') transform = 'translateX(-120%) rotate(-18deg)'
  if (exitDir === 'right') transform = 'translateX(120%) rotate(18deg)'
  if (exitDir === 'up') transform = 'translateY(-130%) scale(1.1)'

  const swipeHint =
    offset.x > 40 ? 'right' : offset.x < -40 ? 'left' : offset.y < -40 ? 'up' : null

  return (
    <div className="swipeable-wrap">
      {!reduced && (
        <div className="swipe-hints" aria-hidden="true">
          <span className={`swipe-hint swipe-hint--pass${swipeHint === 'left' ? ' is-active' : ''}`}>
            Pass ←
          </span>
          <span className={`swipe-hint swipe-hint--super${swipeHint === 'up' ? ' is-active' : ''}`}>
            Super ↑
          </span>
          <span className={`swipe-hint swipe-hint--waddle${swipeHint === 'right' ? ' is-active' : ''}`}>
            Waddle →
          </span>
        </div>
      )}
      <div
        ref={cardRef}
        className={`swipeable-card${dragging ? ' is-dragging' : ''}`}
        style={{
          transform,
          opacity,
          transition: dragging ? 'none' : 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.28s ease',
        }}
      >
        {children}
      </div>
    </div>
  )
}
