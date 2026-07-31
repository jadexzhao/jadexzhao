import { useCallback, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'

export const SWIPE_THRESHOLD_PX = 60
export const SWIPE_VELOCITY_PX_MS = 0.35
export const SWIPE_DIRECTION_LOCK_PX = 12

export interface SwipeGestureConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  velocityThreshold?: number
  directionLockPx?: number
  enabled?: boolean
}

export interface SwipeGestureBind {
  onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void
}

interface GestureSession {
  pointerId: number
  startX: number
  startY: number
  startTime: number
  axis: 'horizontal' | 'vertical' | null
  captured: boolean
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = SWIPE_THRESHOLD_PX,
  velocityThreshold = SWIPE_VELOCITY_PX_MS,
  directionLockPx = SWIPE_DIRECTION_LOCK_PX,
  enabled = true,
}: SwipeGestureConfig) {
  const sessionRef = useRef<GestureSession | null>(null)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const reset = useCallback(() => {
    sessionRef.current = null
    setDragX(0)
    setIsDragging(false)
  }, [])

  const finishSwipe = useCallback(
    (deltaX: number, elapsedMs: number) => {
      const velocity = Math.abs(deltaX) / Math.max(elapsedMs, 1)
      const passedDistance = Math.abs(deltaX) >= threshold
      const passedVelocity = velocity >= velocityThreshold

      if (passedDistance || passedVelocity) {
        if (deltaX < 0) onSwipeLeft?.()
        else onSwipeRight?.()
      }
      reset()
    },
    [threshold, velocityThreshold, onSwipeLeft, onSwipeRight, reset],
  )

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || e.button !== 0) return
      sessionRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startTime: performance.now(),
        axis: null,
        captured: false,
      }
    },
    [enabled],
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const session = sessionRef.current
      if (!session || session.pointerId !== e.pointerId) return

      const dx = e.clientX - session.startX
      const dy = e.clientY - session.startY

      if (session.axis === null) {
        const absX = Math.abs(dx)
        const absY = Math.abs(dy)
        if (absX < directionLockPx && absY < directionLockPx) return

        if (absX > absY) {
          session.axis = 'horizontal'
          e.currentTarget.setPointerCapture(e.pointerId)
          session.captured = true
          setIsDragging(true)
        } else {
          session.axis = 'vertical'
          reset()
          return
        }
      }

      if (session.axis === 'horizontal') {
        e.preventDefault()
        setDragX(dx)
      }
    },
    [directionLockPx, reset],
  )

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const session = sessionRef.current
      if (!session || session.pointerId !== e.pointerId) return

      if (session.captured) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
          /* already released */
        }
      }

      if (session.axis === 'horizontal') {
        const elapsed = performance.now() - session.startTime
        finishSwipe(e.clientX - session.startX, elapsed)
      } else {
        reset()
      }
    },
    [finishSwipe, reset],
  )

  const onPointerCancel = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const session = sessionRef.current
      if (!session || session.pointerId !== e.pointerId) return
      if (session.captured) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
          /* already released */
        }
      }
      reset()
    },
    [reset],
  )

  const style: CSSProperties = {
    transform: dragX !== 0 ? `translateX(${dragX}px)` : undefined,
    transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
    touchAction: 'pan-y',
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  const bind: SwipeGestureBind = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  }

  return { bind, style, dragX, isDragging }
}
