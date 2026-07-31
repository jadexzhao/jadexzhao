import { useEffect, useRef } from 'react'
import { RippleButton } from './RippleButton'

const PRESET_OBSESSIONS = [
  'Ship playful interfaces before the pond freezes',
  'Sunrise paddles & artisan bread crumbs',
  'Zero-merge-conflict code reviews by the lake',
  '4.5:1 contrast in love letters AND landing pages',
  'Konami-code easter eggs in production',
  'Catching every breadcrumb on the pond',
  'Finding someone who gets 福州 puns',
]

interface ObsessionEditorProps {
  open: boolean
  value: string
  onSave: (value: string) => void
  onClose: () => void
}

export function ObsessionEditor({ open, value, onSave, onClose }: ObsessionEditorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      window.setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.value = value
          inputRef.current.focus()
        }
      }, 50)
    }
    if (!open && dialog.open) dialog.close()
  }, [open, value])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputRef.current?.value.trim()
    if (trimmed) onSave(trimmed)
    onClose()
  }

  return (
    <dialog ref={dialogRef} className="obsession-picker" onClose={onClose} aria-labelledby="obsession-title">
      <form className="obsession-picker__form" onSubmit={handleSubmit}>
        <h2 id="obsession-title" className="obsession-picker__title">
          Set your current obsession
        </h2>
        <p className="obsession-picker__hint">What's capturing your pond energy right now?</p>

        <label htmlFor="obsession-input" className="visually-hidden">
          Current obsession
        </label>
        <input
          ref={inputRef}
          id="obsession-input"
          type="text"
          className="obsession-picker__input"
          defaultValue={value}
          maxLength={80}
          placeholder="e.g. Perfect pond-side UX"
        />

        <div className="obsession-picker__presets" aria-label="Suggested obsessions">
          {PRESET_OBSESSIONS.map((preset) => (
            <button
              key={preset}
              type="button"
              className="obsession-picker__preset"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = preset
              }}
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="obsession-picker__actions">
          <RippleButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </RippleButton>
          <RippleButton type="submit" variant="primary" className="quack-btn quack-btn--primary">
            Save obsession ✨
          </RippleButton>
        </div>
      </form>
    </dialog>
  )
}
