import { DuckAvatar } from './DuckAvatar'
import { RippleButton } from './RippleButton'

interface FarmGateProps {
  onEnter: () => void
  onNest: () => void
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
  embedded?: boolean
}

export function FarmGate({ onEnter, onNest, theme, onToggleTheme, embedded }: FarmGateProps) {
  const Tag = embedded ? 'section' : 'main'
  return (
    <Tag className={`farm-gate${embedded ? ' farm-gate--embedded' : ''}`} id="enter-pond">
      {!embedded && theme && onToggleTheme && (
        <button
          type="button"
          className="farm-gate__theme"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Switch to dusk' : 'Switch to dawn'}
        >
          {theme === 'light' ? 'Dusk' : 'Dawn'}
        </button>
      )}

      <p className="farm-gate__kicker">
        <span lang="zh-Hans">鸭年</span>
        {' · Greenfield, Indiana'}
      </p>

      <div className="farm-gate__mark">
        <DuckAvatar size="lg" label="Duck farm" bounce tilt />
      </div>

      {embedded ? (
        <p className="farm-gate__title">Duck farm</p>
      ) : (
        <h1 className="farm-gate__title">Duck farm</h1>
      )}

      <p className="farm-gate__lede">
        A pond that has to hold every morning. Ducks, water, grass, mud. Jade tests it herself.
      </p>

      <div className="farm-gate__ctas">
        <RippleButton
          variant="primary"
          className="quack-btn quack-btn--primary farm-gate__cta"
          onClick={onEnter}
        >
          Enter the pond
        </RippleButton>
        <RippleButton className="farm-gate__cta farm-gate__cta--ghost" onClick={onNest}>
          Your nest
        </RippleButton>
      </div>

      <p className="farm-gate__aside">
        Long-term creative throughline. Self-tested on this pond. Not a dating product.
      </p>
    </Tag>
  )
}
