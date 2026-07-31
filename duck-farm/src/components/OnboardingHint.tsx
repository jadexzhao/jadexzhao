import { RippleButton } from './RippleButton'

interface OnboardingHintProps {
  onDismiss: () => void
  onTryDiscover: () => void
}

export function OnboardingHint({ onDismiss, onTryDiscover }: OnboardingHintProps) {
  return (
    <div className="onboard-hint" role="status" aria-live="polite">
      <div className="onboard-hint__icon" aria-hidden="true">
        🦆
      </div>
      <div className="onboard-hint__body">
        <p className="onboard-hint__title">Welcome to the pond!</p>
        <p className="onboard-hint__text">
          Swipe <strong>→ waddle</strong>, <strong>← pass</strong>, or <strong>↑ super quack</strong> in
          Discover. Post a quack on Feed, then peek your Matches.
        </p>
      </div>
      <div className="onboard-hint__actions">
        <RippleButton variant="primary" className="quack-btn quack-btn--primary onboard-hint__cta" onClick={onTryDiscover}>
          Try Discover
        </RippleButton>
        <button type="button" className="onboard-hint__dismiss" onClick={onDismiss}>
          Got it
        </button>
      </div>
    </div>
  )
}
