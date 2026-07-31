import { useEffect, useRef, useState } from 'react'
import { DuckAvatar } from './DuckAvatar'
import { useReducedMotion } from '../hooks/useReducedMotion'
import type { DuckProfile } from '../data/mockData'

interface MatchModalProps {
  profile: DuckProfile | null
  superQuack?: boolean
  onClose: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  vx: number
  vy: number
  rotation: number
}

const CONFETTI_COLORS = ['#4a9d7a', '#f97316', '#6366f1', '#f0c84a', '#d97828', '#5cb896']

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    y: 40 + (Math.random() - 0.5) * 10,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? '#4a9d7a',
    size: 6 + Math.random() * 8,
    vx: (Math.random() - 0.5) * 8,
    vy: -4 - Math.random() * 6,
    rotation: Math.random() * 360,
  }))
}

export function MatchModal({ profile, superQuack, onClose }: MatchModalProps) {
  const reduced = useReducedMotion()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!profile || !dialog) return

    if (!dialog.open) dialog.showModal()
    if (!reduced) setParticles(createParticles(superQuack ? 48 : 28))

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [profile, superQuack, reduced, onClose])

  useEffect(() => {
    if (reduced || particles.length === 0) return

    let frame: number
    const tick = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.15,
            y: p.y + p.vy * 0.15,
            vy: p.vy + 0.25,
            rotation: p.rotation + p.vx,
          }))
          .filter((p) => p.y < 110),
      )
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [particles.length, reduced])

  if (!profile) return null

  return (
    <dialog ref={dialogRef} className="match-modal" onClose={onClose} aria-labelledby="match-title">
      <div className="match-modal__content match-modal__content--open">
        {!reduced && (
          <div className="match-modal__particles" aria-hidden="true">
            {particles.map((p) => (
              <span
                key={p.id}
                className="match-modal__particle"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size * 0.6,
                  background: p.color,
                  transform: `rotate(${p.rotation}deg)`,
                }}
              />
            ))}
          </div>
        )}

        <div className="match-modal__splash" aria-hidden="true">
          <span className="match-modal__ripple match-modal__ripple--1" />
          <span className="match-modal__ripple match-modal__ripple--2" />
          <span className="match-modal__ripple match-modal__ripple--3" />
        </div>

        <div className="match-modal__ducks">
          <DuckAvatar size="lg" emoji="🦆" label="Your avatar" bounce />
          <span className="match-modal__heart" aria-hidden="true">
            {superQuack ? '⭐' : '💚'}
          </span>
          <DuckAvatar size="lg" emoji={profile.emoji} label={`${profile.displayName}'s avatar`} bounce />
        </div>

        <h2 id="match-title" className="match-modal__title">
          {superQuack ? 'Super Quack!' : "It's a waddle!"}
        </h2>
        <p className="match-modal__subtitle">
          You and <strong>{profile.displayName}</strong> are synced on the pond
          {superQuack && ' — legendary chemistry!'}
        </p>

        <button type="button" className="quack-btn quack-btn--primary match-modal__close" onClick={onClose}>
          Keep waddling →
        </button>
      </div>
    </dialog>
  )
}
