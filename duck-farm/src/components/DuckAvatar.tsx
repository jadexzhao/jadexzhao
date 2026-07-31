interface DuckAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  emoji?: string
  label?: string
  bounce?: boolean
  tilt?: boolean
}

const SIZE_MAP = {
  sm: 36,
  md: 48,
  lg: 64,
} as const

export function DuckAvatar({ size = 'md', emoji, label, bounce, tilt }: DuckAvatarProps) {
  const px = SIZE_MAP[size]
  const classes = [
    'duck-avatar',
    `duck-avatar--${size}`,
    bounce ? 'duck-avatar--bounce' : '',
    tilt ? 'duck-avatar--tilt' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} role="img" aria-label={label ?? 'Duck avatar'}>
      <svg
        className="duck-avatar__svg"
        viewBox="0 0 48 40"
        width={px}
        height={Math.round(px * 0.83)}
        focusable="false"
        aria-hidden="true"
      >
        <ellipse className="duck-avatar__body" cx="22" cy="26" rx="16" ry="10" />
        <circle className="duck-avatar__head" cx="34" cy="16" r="9" />
        <ellipse className="duck-avatar__wing" cx="18" cy="25" rx="8" ry="5" />
        <path className="duck-avatar__beak" d="M42 16 L50 18 L42 21 Z" />
        <circle className="duck-avatar__eye" cx="37" cy="14" r="1.6" />
      </svg>
      {emoji && (
        <span className="duck-avatar__badge" aria-hidden="true">
          {emoji}
        </span>
      )}
    </span>
  )
}
