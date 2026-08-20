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
  const offsetRef = useRef({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [exitDir, setExitDir] = useState<SwipeDirection>(null)

  draggingRef.current = dragging

  useEffect(() => {
    setOffset({ x: 0, y: 0 })
    offsetRef.current = { x: 0, y: 0 }
    setExitDir(null)
  }, [cardKey])

  const reset = () => {
    setOffset({ x: 0, y: 0 })
    offsetRef.current = { x: 0, y: 0 }
    setDragging(false)
    setExitDir(null)
    startRef.current = null
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
    const next = { x: dx, y: Math.min(0, dy) }
    offsetRef.current = next
    setOffset(next)
  }

  const handleEnd = () => {
    if (!startRef.current || reduced || exitDir) {
      reset()
      return
    }

    const { x, y } = offsetRef.current

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
      if (t) {
        e.preventDefault()
        handleMove(t.clientX, t.clientY)
      }
    }
    const onTouchEnd = () => handleEnd()

    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY)
    const onMouseMove = (e: MouseEvent) => {
      if (draggingRef.current) handleMove(e.clientX, e.clientY)
    }
    const onMouseUp = () => handleEnd()

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebind on card change only
  }, [cardKey, reduced, exitDir])

  const rotation = reduced ? 0 : offset.x * 0.06
  const opacity = exitDir ? 0 : 1
  const scale = exitDir === 'up' ? 1.08 : 1

  let transform = `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${scale})`
  if (exitDir === 'left') transform = 'translateX(-120%) rotate(-18deg)'
  if (exitDir === 'right') transform = 'translateX(120%) rotate(18deg)'
  if (exitDir === 'up') transform = 'translateY(-130%) scale(1.1)'

  const passStrength = Math.min(1, Math.max(0, -offset.x / SWIPE_THRESHOLD))
  const waddleStrength = Math.min(1, Math.max(0, offset.x / SWIPE_THRESHOLD))
  const superStrength = Math.min(1, Math.max(0, -offset.y / UP_THRESHOLD))

  const stamp =
    exitDir === 'left' || (!exitDir && passStrength > 0.35)
      ? 'pass'
      : exitDir === 'right' || (!exitDir && waddleStrength > 0.35)
        ? 'waddle'
        : exitDir === 'up' || (!exitDir && superStrength > 0.35)
          ? 'super'
          : null

  const stampOpacity = stamp
    ? exitDir
      ? 1
      : stamp === 'pass'
        ? passStrength
        : stamp === 'waddle'
          ? waddleStrength
          : superStrength
    : 0

  return (
    <div className="swipeable-wrap">
      {reduced ? (
        <p className="swipe-hints swipe-hints--static">Use Pass or Start waddle. Swipe is off for reduced motion.</p>
      ) : (
        <div className="swipe-hints" aria-hidden="true">
          <span className={`swipe-hint swipe-hint--pass${stamp === 'pass' ? ' is-active' : ''}`}>
            Pass ←
          </span>
          <span className={`swipe-hint swipe-hint--super${stamp === 'super' ? ' is-active' : ''}`}>
            Super ↑
          </span>
          <span className={`swipe-hint swipe-hint--waddle${stamp === 'waddle' ? ' is-active' : ''}`}>
            Waddle →
          </span>
        </div>
      )}
      <div
        ref={cardRef}
        className={`swipeable-card${dragging ? ' is-dragging' : ''}${stamp ? ` is-stamp-${stamp}` : ''}`}
        style={{
          transform,
          opacity,
          transition: dragging
            ? 'none'
            : 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.28s ease',
        }}
      >
        {stamp && (
          <div
            className={`swipe-stamp swipe-stamp--${stamp}`}
            style={{ opacity: stampOpacity }}
            aria-hidden="true"
          >
            {stamp === 'pass' ? 'PASS' : stamp === 'waddle' ? 'WADDLE' : 'SUPER'}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
