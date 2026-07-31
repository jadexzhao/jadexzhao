import { useEffect } from 'react'

export interface KeyboardNavConfig {
  onPrev?: () => void
  onNext?: () => void
  onEscape?: () => void
  enabled?: boolean
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return target.isContentEditable
}

export function useKeyboardNav({
  onPrev,
  onNext,
  onEscape,
  enabled = true,
}: KeyboardNavConfig): void {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) {
        if (e.key === 'Escape') onEscape?.()
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'k':
        case 'K':
          e.preventDefault()
          onPrev?.()
          break
        case 'ArrowRight':
        case 'j':
        case 'J':
          e.preventDefault()
          onNext?.()
          break
        case 'Escape':
          onEscape?.()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onPrev, onNext, onEscape])
}
