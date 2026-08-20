import { RippleButton } from './RippleButton'

interface OnboardingHintProps {
  onDismiss: () => void
  onTryDiscover: () => void
  onEditNest: () => void
}

export function OnboardingHint({ onDismiss, onTryDiscover, onEditNest }: OnboardingHintProps) {
  return (
    <div className="onboard-hint" role="status" aria-live="polite">
      <div className="onboard-hint__icon" aria-hidden="true">
        🦆
      </div>
      <div className="onboard-hint__body">
        <p className="onboard-hint__title">Two moves that matter</p>
        <p className="onboard-hint__text">
          <strong>Discover</strong> is the swipe feel (fake deck, real craft).{' '}
          <strong>Your Nest</strong> is the 1st-person gate ... would you keep this profile?
        </p>
      </div>
      <div className="onboard-hint__actions">
        <RippleButton
          variant="primary"
          className="quack-btn quack-btn--primary onboard-hint__cta"
          onClick={onTryDiscover}
        >
          Try Discover
        </RippleButton>
        <button type="button" className="onboard-hint__dismiss" onClick={onEditNest}>
          Edit nest
        </button>
        <button type="button" className="onboard-hint__dismiss" onClick={onDismiss}>
          Got it
        </button>
      </div>
    </div>
  )
}
