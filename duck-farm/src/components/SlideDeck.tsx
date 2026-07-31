import { type ReactNode } from 'react'
import { useSwipeGesture } from '../hooks/useSwipeGesture'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface SlideDeckProps {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  label: string
  children: ReactNode
}

export function SlideDeck({ index, total, onPrev, onNext, label, children }: SlideDeckProps) {
  const reducedMotion = useReducedMotion()
  const canPrev = index > 0
  const canNext = index < total - 1

  const { bind, style, isDragging } = useSwipeGesture({
    onSwipeLeft: canNext ? onNext : undefined,
    onSwipeRight: canPrev ? onPrev : undefined,
    enabled: total > 1 && !reducedMotion,
  })

  const deckStyle = reducedMotion
    ? undefined
    : {
        ...style,
        opacity: isDragging ? 0.92 : 1,
      }

  return (
    <div
      className={`slide-deck${isDragging ? ' is-dragging' : ''}${reducedMotion ? ' slide-deck--reduced' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="slide-deck__viewport" {...bind} style={deckStyle}>
        <div key={index} className="slide-deck__slide">
          {children}
        </div>
      </div>
      <p className="slide-deck__hint visually-hidden" aria-live="polite">
        Slide {index + 1} of {total}. Drag horizontally or use arrow keys / j and k.
      </p>
    </div>
  )
}
