import {
  useState,
  useCallback,
  useId,
  useMemo,
  useEffect,
  useRef,
  lazy,
  Suspense,
  type ReactNode,
} from 'react'
import { DuckAvatar } from './components/DuckAvatar'
import { SlideDeck } from './components/SlideDeck'
import { SwipeableCard } from './components/SwipeableCard'
import { MatchModal } from './components/MatchModal'
import { ObsessionEditor } from './components/ObsessionEditor'
import { AnimatedCounter } from './components/AnimatedCounter'
import { RippleButton } from './components/RippleButton'
import { OnboardingHint } from './components/OnboardingHint'
import { EmptyState } from './components/EmptyState'

const BreadcrumbGame = lazy(() =>
  import('./components/BreadcrumbGame').then((m) => ({ default: m.BreadcrumbGame })),
)
import { useLocalStorage, useLocalStorageSet } from './hooks/useLocalStorage'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { useReducedMotion } from './hooks/useReducedMotion'
import {
  CURRENT_USER,
  DUCK_PROFILES,
  INITIAL_QUACKS,
  TRENDING_TOPICS,
  getProfile,
  type Quack,
  type DuckProfile,
  type DuckMood,
} from './data/mockData'
import { initDoorEggs } from './eggs'
import './App.css'

type Theme = 'light' | 'dark'
type NavItem = 'home' | 'explore' | 'matches' | 'profile'
type MoodFilter = 'all' | DuckMood

const NAV_LABELS: Record<NavItem, string> = {
  home: 'Pond Feed',
  explore: 'Discover',
  matches: 'Matches',
  profile: 'Your Nest',
}

const ONBOARD_KEY = 'quack-onboarded-v2'

const COMPOSE_ACK_MS = 720

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

function mergeQuacks(userPosts: Quack[]): Quack[] {
  const userIds = new Set(userPosts.map((q) => q.id))
  const base = INITIAL_QUACKS.filter((q) => !userIds.has(q.id))
  return [...userPosts, ...base]
}

function VerifiedBadge() {
  return (
    <svg className="verified-badge" viewBox="0 0 24 24" aria-label="Verified" role="img">
      <path
        fill="currentColor"
        d="M10.521 3.821c.482-1.028 1.865-1.028 2.348 0l1.732 3.697a1.5 1.5 0 0 0 1.148.85l3.992.58c1.11.161 1.555 1.527.751 2.312l-2.888 2.816a1.5 1.5 0 0 0-.432 1.328l.682 3.976c.19 1.108-.972 1.953-1.963 1.407l-3.573-1.878a1.5 1.5 0 0 0-1.396 0l-3.573 1.878c-.991.546-2.153-.3-1.963-1.407l.682-3.976a1.5 1.5 0 0 0-.432-1.328L2.858 11.26c-.804-.785-.359-2.151.751-2.312l3.992-.58a1.5 1.5 0 0 0 1.148-.85l1.732-3.697z"
      />
    </svg>
  )
}

/** Wrap CJK runs so screen readers get lang + Noto Serif SC applies. */
function withCjkLang(text: string): ReactNode {
  const parts = text.split(/([\u4e00-\u9fff]+)/)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    /[\u4e00-\u9fff]/.test(part) ? (
      <span key={i} lang="zh-Hans">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

function ProfileMeta({ profile }: { profile: DuckProfile }) {
  return (
    <div className="profile-meta">
      <span className="profile-meta__name">
        {profile.displayName}
        {profile.verified && <VerifiedBadge />}
      </span>
      <span className="profile-meta__handle">@{profile.handle}</span>
    </div>
  )
}

function ObsessionBanner({ obsession, onEdit }: { obsession: string; onEdit: () => void }) {
  return (
    <div className="obsession-banner">
      <div className="obsession-banner__text">
        <span className="obsession-banner__label">Your Current Obsession</span>
        <p className="obsession-banner__value">{obsession}</p>
      </div>
      <RippleButton type="button" variant="ghost" className="obsession-banner__link" onClick={onEdit}>
        Update obsession →
      </RippleButton>
    </div>
  )
}

const MOOD_FILTERS: { id: MoodFilter; label: string; emoji?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'single', label: 'Single', emoji: '🧡' },
  { id: 'wading', label: 'Wading', emoji: '🤝' },
  { id: 'matched', label: 'Matched', emoji: '💚' },
]

function FilterPills({
  active,
  onChange,
}: {
  active: MoodFilter
  onChange: (filter: MoodFilter) => void
}) {
  return (
    <div className="filter-pills" role="radiogroup" aria-label="Filter ducks">
      {MOOD_FILTERS.map(({ id, label, emoji }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={active === id}
          className={`filter-pill${active === id ? ' is-active' : ''}`}
          onClick={() => onChange(id)}
        >
          {emoji && <span aria-hidden="true">{emoji} </span>}
          {label}
        </button>
      ))}
    </div>
  )
}

function DeckNav({
  index,
  total,
  onPrev,
  onNext,
  onGoTo,
}: {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  onGoTo: (i: number) => void
}) {
  if (total <= 1) return null

  return (
    <div className="deck-nav" aria-label="Slide navigation">
      <div className="deck-nav__dots" role="group" aria-label="Slides">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-current={i === index ? 'true' : undefined}
            aria-label={`Slide ${i + 1} of ${total}`}
            className={`deck-nav__dot${i === index ? ' is-active' : ''}`}
            onClick={() => onGoTo(i)}
          />
        ))}
      </div>
      <div className="deck-nav__controls">
        <span className="deck-nav__counter" aria-live="polite">
          {index + 1}/{total}
        </span>
        <RippleButton className="deck-nav__arrow" aria-label="Previous slide" disabled={index === 0} onClick={onPrev}>
          ←
        </RippleButton>
        <RippleButton
          className="deck-nav__arrow deck-nav__arrow--next"
          aria-label="Next slide"
          disabled={index >= total - 1}
          onClick={onNext}
        >
          →
        </RippleButton>
      </div>
      <p className="deck-nav__kbd-hint visually-hidden">
        Use arrow keys to navigate slides
      </p>
    </div>
  )
}

function QuackSlide({
  quack,
  onFlirt,
  onRequack,
}: {
  quack: Quack
  onFlirt: (id: string) => void
  onRequack: (id: string) => void
}) {
  const author = getProfile(quack.authorId)
  if (!author) return null

  return (
    <article className={`slide-card quack-slide card-tilt${quack.pending ? ' quack-slide--pending' : ''}`}>
      <header className="quack-slide__header">
        <DuckAvatar size="lg" emoji={author.emoji} label={`${author.displayName}'s avatar`} bounce tilt />
        <ProfileMeta profile={author} />
        <span className="quack-slide__time">
          · {quack.timestamp}
          {quack.pending && (
            <span className="quack-slide__pending-badge" aria-live="polite">
              {' '}
              · sending...
            </span>
          )}
        </span>
      </header>
      {author.obsession && (
        <p className="quack-slide__obsession">
          <span aria-hidden="true">✨ </span>
          {author.obsession}
        </p>
      )}
      <p className="quack-slide__content">{quack.content}</p>
      <div className="quack-slide__actions" role="group" aria-label="Quack actions">
        <span className="slide-action slide-action--static" aria-label={`${quack.replies} replies`}>
          <ReplyIcon />
          <span>{formatCount(quack.replies)}</span>
        </span>
        <RippleButton
          variant="ghost"
          className="slide-action slide-action--requack"
          aria-label={`${quack.requacks} requacks`}
          disabled={quack.pending}
          onClick={() => onRequack(quack.id)}
        >
          <RequackIcon />
          <AnimatedCounter value={quack.requacks} format={formatCount} />
        </RippleButton>
        <RippleButton
          variant="ghost"
          className={`slide-action slide-action--heart${quack.flirted ? ' is-active' : ''}`}
          aria-label={quack.flirted ? 'Unflirt' : 'Flirt'}
          aria-pressed={quack.flirted}
          disabled={quack.pending}
          onClick={() => onFlirt(quack.id)}
        >
          <HeartIcon filled={quack.flirted} />
          <AnimatedCounter value={quack.hearts + (quack.flirted ? 1 : 0)} format={formatCount} />
        </RippleButton>
        <span className="slide-action slide-action--static" aria-label="Share unavailable in this demo">
          <ShareIcon />
        </span>
      </div>
    </article>
  )
}

function moodBadge(mood: DuckMood): { emoji: string; label: string } {
  switch (mood) {
    case 'single':
      return { emoji: '🧡', label: 'Single' }
    case 'wading':
      return { emoji: '🤝', label: 'Wading' }
    case 'matched':
      return { emoji: '💚', label: 'Matched' }
  }
}

function DiscoverCard({
  profile,
  onMatch,
  onPass,
  matched,
}: {
  profile: DuckProfile
  onMatch: (id: string) => void
  onPass?: (id: string) => void
  matched: boolean
}) {
  const badge = moodBadge(profile.mood)

  return (
    <article className="slide-card discover-card card-tilt">
      <div className="discover-card__hero">
        <DuckAvatar size="lg" emoji={profile.emoji} label={`${profile.displayName}'s avatar`} bounce tilt />
        <span className="discover-card__mood">
          {badge.emoji} {badge.label}
        </span>
        <span className="discover-card__score" title="Sample duck in a sandbox deck">
          sample
        </span>
      </div>
      <div className="discover-card__body">
        <h2 className="discover-card__name">
          {profile.displayName}
          {profile.verified && <VerifiedBadge />}
        </h2>
        <p className="discover-card__pond">{withCjkLang(profile.pond)}</p>
        {profile.obsession && (
          <p className="discover-card__obsession">
            <span aria-hidden="true">✨ </span>
            {withCjkLang(profile.obsession)}
          </p>
        )}
        {profile.sharedInterests && profile.sharedInterests.length > 0 && (
          <p className="discover-card__detail">
            <strong>Shared interests:</strong> {profile.sharedInterests.join(', ')}
          </p>
        )}
        {profile.bucketList && (
          <p className="discover-card__detail">
            <strong>Bucket list:</strong> {profile.bucketList}
          </p>
        )}
        <p className="discover-card__bio">{withCjkLang(profile.bio)}</p>
      </div>
      <div className="discover-card__actions">
        {onPass && (
          <RippleButton
            className="discover-btn discover-btn--wave"
            onClick={() => onPass(profile.id)}
            aria-label={`Pass on ${profile.displayName}`}
          >
            Pass
          </RippleButton>
        )}
        <RippleButton
          variant="primary"
          className={`discover-btn discover-btn--connect${matched ? ' is-matched' : ''}`}
          onClick={() => onMatch(profile.id)}
          aria-pressed={matched}
        >
          {matched ? '💚 Matched' : '💚 Start waddle'}
        </RippleButton>
      </div>
    </article>
  )
}

function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
    </svg>
  )
}

function RequackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {filled ? (
        <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.647 2.973.816-1.393 2.357-2.973 4.647-2.973 2.878 0 5.404 2.69 5.404 5.754 0 6.376-7.454 13.11-10.037 13.157H12z" />
      ) : (
        <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.097 6.61 3.84-2.34 6.023-4.64 7.097-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
      )}
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.29 3.3-1.42-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.2 3.8 10.2c-.3.26-.3.72.02.96L5 12.2v7.05c0 .41.34.75.75.75H9.5v-5.2h5v5.2h3.75c.41 0 .75-.34.75-.75V12.2l1.18-1.04c.32-.24.32-.7.02-.96L12 3.2z" />
    </svg>
  )
}

function ExploreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.747-.526 3.374-1.428 4.729l4.147 4.147a.75.75 0 1 1-1.06 1.06l-4.147-4.147A8.456 8.456 0 0 1 10.25 19.25c-4.694 0-8.5-3.806-8.5-8.5z" />
    </svg>
  )
}

function MatchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5a4 4 0 0 0-8 0v12.5c0 3.31 2.69 6 6 6s6-2.69 6-6V6h-1.5z" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.687 13.838 13 12 13s-3.317.687-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.543-2h11.412c-.331-1.166-.817-2.027-1.445-2.574C15.318 13.687 13.838 13 12 13s-3.317.687-4.404 1.81c-.628.547-1.114 1.408-1.445 2.574zM12 13c2.485 0 4.5-2.015 4.5-4.5S14.485 4 12 4 7.5 6.015 7.5 8.5 9.515 13 12 13zm0-2c-1.381 0-2.5-1.119-2.5-2.5S10.619 6 12 6s2.5 1.119 2.5 2.5S13.381 11 12 11z" />
    </svg>
  )
}

function QuackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  )
}

const NAV_ITEMS: { id: NavItem; label: string; Icon: () => JSX.Element }[] = [
  { id: 'home', label: 'Feed', Icon: HomeIcon },
  { id: 'explore', label: 'Discover', Icon: ExploreIcon },
  { id: 'matches', label: 'Matches', Icon: MatchIcon },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon },
]

function useDeckIndex(total: number) {
  const [index, setIndex] = useState(0)
  const clamped = Math.min(index, Math.max(0, total - 1))

  return {
    index: clamped,
    goPrev: () => setIndex((i) => Math.max(0, i - 1)),
    goNext: () => setIndex((i) => Math.min(total - 1, i + 1)),
    goTo: (i: number) => setIndex(Math.max(0, Math.min(total - 1, i))),
    reset: () => setIndex(0),
  }
}

export default function App() {
  const composeId = useId()
  const composeRef = useRef<HTMLTextAreaElement>(null)
  const reducedMotion = useReducedMotion()

  const [theme, setTheme] = useLocalStorage<Theme>(
    'quack-theme',
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    (v) => v,
    (s) => s as Theme,
  )
  const [matches, setMatches] = useLocalStorageSet('quack-matches', ['drake'])
  const [passed, setPassed] = useLocalStorageSet('quack-passed', [])
  const [userPosts, setUserPosts] = useLocalStorage<Quack[]>('quack-posts', [])
  const [obsession, setObsession] = useLocalStorage<string>(
    'quack-obsession',
    CURRENT_USER.obsession ?? 'Finding your next obsession...',
  )

  const [activeNav, setActiveNav] = useState<NavItem>('home')
  const [moodFilter, setMoodFilter] = useState<MoodFilter>('all')
  const [quacks, setQuacks] = useState<Quack[]>(() => mergeQuacks(userPosts))
  const [draft, setDraft] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [obsessionOpen, setObsessionOpen] = useState(false)
  const [matchModal, setMatchModal] = useState<{ profile: DuckProfile; superQuack: boolean } | null>(null)
  const [showOnboard, setShowOnboard] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(ONBOARD_KEY) !== '1'
  })
  const [nestGate, setNestGate] = useLocalStorage<'pending' | 'kept' | 'shaping'>(
    'quack-nest-gate',
    'pending',
  )

  useEffect(() => {
    initDoorEggs()
  }, [])

  useEffect(() => {
    const userOnly = quacks.filter((q) => q.authorId === CURRENT_USER.id && !q.pending)
    setUserPosts(userOnly)
  }, [quacks, setUserPosts])

  const filteredProfiles = useMemo(() => {
    const list = [...DUCK_PROFILES]
      .filter((p) => !passed.has(p.id))
      .sort((a, b) => (a.demoOrder ?? 99) - (b.demoOrder ?? 99))
    if (moodFilter === 'all') return list
    return list.filter((p) => p.mood === moodFilter)
  }, [moodFilter, passed])

  const matchedProfiles = useMemo(
    () => DUCK_PROFILES.filter((p) => matches.has(p.id)),
    [matches],
  )

  const feedDeck = useDeckIndex(quacks.length)
  const discoverDeck = useDeckIndex(filteredProfiles.length)
  const matchDeck = useDeckIndex(matchedProfiles.length)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }, [])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const handleNavChange = (nav: NavItem) => {
    setActiveNav(nav)
    feedDeck.reset()
    discoverDeck.reset()
    matchDeck.reset()
  }

  const dismissOnboard = useCallback(() => {
    setShowOnboard(false)
    try {
      localStorage.setItem(ONBOARD_KEY, '1')
    } catch {
      /* private mode */
    }
  }, [])

  const tryDiscover = useCallback(() => {
    dismissOnboard()
    handleNavChange('explore')
  }, [dismissOnboard])

  const tryNest = useCallback(() => {
    dismissOnboard()
    handleNavChange('profile')
    setObsessionOpen(true)
  }, [dismissOnboard])

  const handleFlirt = (id: string) => {
    setQuacks((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, flirted: !q.flirted, hearts: q.hearts + (q.flirted ? -1 : 1) }
          : q,
      ),
    )
  }

  const handleRequack = (id: string) => {
    setQuacks((prev) =>
      prev.map((q) => (q.id === id ? { ...q, requacks: q.requacks + 1 } : q)),
    )
    showToast('Requacked to your followers.')
  }

  const triggerMatch = (id: string, superQuack = false) => {
    const profile = getProfile(id)
    if (!profile || matches.has(id)) return
    setMatches((prev) => new Set(prev).add(id))
    setMatchModal({ profile, superQuack })
    showToast(superQuack ? `Super quack with ${profile.displayName}!` : `It's a waddle with ${profile.displayName}!`)
  }

  const handleMatch = (id: string) => {
    if (matches.has(id)) {
      setMatches((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      showToast("Unmatched. They'll find another pond.")
      return
    }
    triggerMatch(id)
  }

  const handlePass = (id: string) => {
    setPassed((prev) => new Set(prev).add(id))
    showToast('Passed ... next duck on the pond.')
  }

  const handlePost = () => {
    const trimmed = draft.trim()
    if (!trimmed || isPosting) return

    const id = `q-${Date.now()}`
    const optimistic: Quack = {
      id,
      authorId: CURRENT_USER.id,
      content: trimmed,
      timestamp: 'now',
      replies: 0,
      requacks: 0,
      hearts: 0,
      pending: true,
    }

    setIsPosting(true)
    setDraft('')
    setQuacks((prev) => [optimistic, ...prev])
    feedDeck.reset()
    showToast('Quack posted to the pond.')

    window.setTimeout(() => {
      setQuacks((prev) => prev.map((q) => (q.id === id ? { ...q, pending: false } : q)))
      setIsPosting(false)
    }, COMPOSE_ACK_MS)
  }

  const activeDeck =
    activeNav === 'home'
      ? feedDeck
      : activeNav === 'explore'
        ? discoverDeck
        : activeNav === 'matches'
          ? matchDeck
          : null

  const deckTotal =
    activeNav === 'home'
      ? quacks.length
      : activeNav === 'explore'
        ? filteredProfiles.length
        : activeNav === 'matches'
          ? matchedProfiles.length
          : 0

  const modalOpen = matchModal !== null || obsessionOpen

  useKeyboardNav({
    enabled: !modalOpen && activeDeck !== null,
    onPrev: () => activeDeck?.goPrev(),
    onNext: () => activeDeck?.goNext(),
  })

  const currentDiscover = filteredProfiles[discoverDeck.index]

  return (
    <div className={`quack-app quack-app--${theme}`} data-theme={theme}>
      <a href="#main-feed" className="skip-link">
        Skip to main content
      </a>

      <div className="quack-shell">
        <aside className="quack-nav" aria-label="Main navigation">
          <div className="quack-nav__brand">
            <span className="quack-nav__icon" aria-hidden="true">
              🦆
            </span>
            <span className="quack-nav__logo">Quackr</span>
            <span className="quack-nav__badge">V2</span>
          </div>

          <nav className="quack-nav__links">
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <RippleButton
                key={id}
                className={`quack-nav__item${activeNav === id ? ' is-active' : ''}`}
                aria-current={activeNav === id ? 'page' : undefined}
                onClick={() => handleNavChange(id)}
              >
                <Icon />
                <span>{label}</span>
              </RippleButton>
            ))}
          </nav>

          <RippleButton
            variant="primary"
            className="quack-btn quack-btn--primary quack-nav__compose"
            onClick={() => {
              handleNavChange('home')
              window.setTimeout(() => composeRef.current?.focus(), 100)
            }}
          >
            <QuackIcon />
            <span>Quack</span>
          </RippleButton>

          <div className="quack-nav__user">
            <DuckAvatar size="sm" emoji={CURRENT_USER.emoji} label="Your profile" bounce />
            <div className="quack-nav__user-info">
              <span className="quack-nav__user-name">{CURRENT_USER.displayName}</span>
              <span className="quack-nav__user-handle">@{CURRENT_USER.handle}</span>
            </div>
          </div>

          <button
            type="button"
            className="quack-nav__theme"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </aside>

        <main id="main-feed" className="quack-main" tabIndex={-1}>
          <header className="quack-hero">
            <div className="quack-hero__top">
              <div className="quack-hero__brand-block">
                <p className="quack-hero__brand">Quackr</p>
                <p className="quack-hero__kicker">
                  duck farm · <span lang="zh-Hans">鸭年</span> · portfolio sandbox
                </p>
              </div>
              <button
                type="button"
                className="quack-main__theme"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
            <p className="quack-hero__lede">
              Someday a real duck farm. For now: a social sandbox with skip links, contrast, and 44px taps
              ... fake ducks, real swipe feel. Not a launched app.
            </p>
            <div className="quack-hero__ctas">
              <RippleButton
                variant="primary"
                className="quack-btn quack-btn--primary quack-hero__cta"
                onClick={tryDiscover}
              >
                Start Discover
              </RippleButton>
              <RippleButton className="quack-hero__cta quack-hero__cta--ghost" onClick={tryNest}>
                Edit your nest
              </RippleButton>
            </div>
            <div className="quack-hero__section-row">
              <h1 className="quack-hero__section">{NAV_LABELS[activeNav]}</h1>
              <span className="quack-hero__deck-note" aria-hidden={activeNav === 'profile'}>
                {activeNav === 'explore'
                  ? 'swipe to decide'
                  : activeNav === 'matches'
                    ? 'saved waddles'
                    : activeNav === 'profile'
                      ? '1st-person gate'
                      : 'sample feed'}
              </span>
            </div>
          </header>

          {showOnboard && (
            <OnboardingHint
              onDismiss={dismissOnboard}
              onTryDiscover={tryDiscover}
              onEditNest={tryNest}
            />
          )}

          {activeNav !== 'profile' && (
            <ObsessionBanner obsession={obsession} onEdit={() => setObsessionOpen(true)} />
          )}

          {(activeNav === 'explore') && (
            <FilterPills
              active={moodFilter}
              onChange={(f) => {
                setMoodFilter(f)
                discoverDeck.reset()
              }}
            />
          )}

          {activeNav === 'home' && (
            <section
              className={`compose${isPosting ? ' is-posting' : ''}`}
              aria-labelledby={composeId}
              aria-busy={isPosting}
            >
              <h2 id={composeId} className="visually-hidden">
                Compose a quack
              </h2>
              <DuckAvatar size="md" emoji={CURRENT_USER.emoji} label="Your avatar" bounce />
              <div className="compose__body">
                <label htmlFor="quack-draft" className="visually-hidden">
                  What's happening on the pond?
                </label>
                <textarea
                  ref={composeRef}
                  id="quack-draft"
                  className="compose__input"
                  placeholder="What's your current obsession on the pond?"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handlePost()
                  }}
                  rows={2}
                  maxLength={280}
                  disabled={isPosting}
                />
                <div className="compose__footer">
                  <span className="compose__count" aria-live="polite">
                    {280 - draft.length}
                  </span>
                  <RippleButton
                    variant="primary"
                    className="quack-btn quack-btn--primary compose__post"
                    disabled={!draft.trim() || isPosting}
                    onClick={handlePost}
                  >
                    {isPosting ? 'Sending...' : 'Quack'}
                  </RippleButton>
                </div>
              </div>
            </section>
          )}

          <section className="deck-stage" aria-label={`${NAV_LABELS[activeNav]} slides`}>
            {activeNav === 'home' && quacks.length === 0 && (
              <div className="slide-card slide-card--empty">
                <EmptyState
                  emoji="🦆"
                  title="Pond feed is empty"
                  message="Compose a quack above. Sample posts load from this sandbox, not a live network."
                />
              </div>
            )}

            {activeNav === 'home' && quacks[feedDeck.index] && (
              <SlideDeck
                index={feedDeck.index}
                total={quacks.length}
                onPrev={feedDeck.goPrev}
                onNext={feedDeck.goNext}
                slideKey={quacks[feedDeck.index].id}
                label="Pond feed slides"
              >
                <QuackSlide
                  quack={quacks[feedDeck.index]}
                  onFlirt={handleFlirt}
                  onRequack={handleRequack}
                />
              </SlideDeck>
            )}

            {activeNav === 'explore' && currentDiscover && (
              <>
                <p className="deck-stage__hint">
                  {filteredProfiles.length} sample ducks
                  {reducedMotion
                    ? ' · use Pass or Start waddle'
                    : ' · swipe, or use the buttons'}
                </p>
                <SwipeableCard
                  cardKey={currentDiscover.id}
                  onSwipeLeft={() => handlePass(currentDiscover.id)}
                  onSwipeRight={() => triggerMatch(currentDiscover.id)}
                  onSwipeUp={() => triggerMatch(currentDiscover.id, true)}
                >
                  <DiscoverCard
                    profile={currentDiscover}
                    matched={matches.has(currentDiscover.id)}
                    onMatch={handleMatch}
                    onPass={handlePass}
                  />
                </SwipeableCard>
              </>
            )}

            {activeNav === 'explore' && filteredProfiles.length === 0 && (
              <div className="slide-card slide-card--empty">
                <EmptyState
                  emoji="🦆"
                  title="Pond's quiet right now"
                  message="No ducks match this filter. Try another mood or give passed ducks another look."
                  action={
                    passed.size > 0
                      ? { label: 'Reset passed ducks', onClick: () => setPassed(new Set()) }
                      : { label: 'Show all ducks', onClick: () => setMoodFilter('all') }
                  }
                />
              </div>
            )}

            {activeNav === 'matches' && matchedProfiles.length > 0 && (
              <>
                <p className="deck-stage__hint">{matchedProfiles.length} waddles</p>
                <SlideDeck
                  index={matchDeck.index}
                  total={matchedProfiles.length}
                  onPrev={matchDeck.goPrev}
                  onNext={matchDeck.goNext}
                  slideKey={matchedProfiles[matchDeck.index].id}
                  label="Your matches"
                >
                  <DiscoverCard
                    profile={matchedProfiles[matchDeck.index]}
                    matched
                    onMatch={handleMatch}
                  />
                </SlideDeck>
              </>
            )}

            {activeNav === 'matches' && matchedProfiles.length === 0 && (
              <div className="slide-card slide-card--empty">
                <EmptyState
                  emoji="💚"
                  title="No waddles yet"
                  message="Head to Discover and swipe right on a duck you vibe with. Your matches land here."
                  action={{ label: 'Discover ducks →', onClick: () => handleNavChange('explore') }}
                />
              </div>
            )}

            {activeNav === 'profile' && (
              <article className="slide-card nest-gate card-tilt">
                <p className="nest-gate__eyebrow">How your nest reads</p>
                <div className="nest-gate__preview">
                  <DuckAvatar size="lg" emoji={CURRENT_USER.emoji} label="Your profile" bounce tilt />
                  <ProfileMeta profile={{ ...CURRENT_USER, obsession }} />
                  <p className="nest-gate__obsession">
                    <span aria-hidden="true">✨ </span>
                    {withCjkLang(obsession)}
                  </p>
                  <p className="nest-gate__bio">{withCjkLang(CURRENT_USER.bio)}</p>
                  <p className="nest-gate__pond">{withCjkLang(CURRENT_USER.pond)}</p>
                </div>

                <div className="nest-gate__ask" role="group" aria-labelledby="nest-gate-q">
                  <h2 id="nest-gate-q" className="nest-gate__question">
                    1st-person gate
                  </h2>
                  <p className="nest-gate__prompt">
                    Would you keep this nest on a real dating app ... or delete the rest after seeing it?
                  </p>
                  <div className="nest-gate__choices">
                    <RippleButton
                      variant="primary"
                      className={`quack-btn quack-btn--primary nest-gate__choice${nestGate === 'kept' ? ' is-selected' : ''}`}
                      aria-pressed={nestGate === 'kept'}
                      onClick={() => {
                        setNestGate('kept')
                        showToast('Nest marked kept ... for your eyes only.')
                      }}
                    >
                      Yes, this nest feels true
                    </RippleButton>
                    <RippleButton
                      className={`nest-gate__choice nest-gate__choice--ghost${nestGate === 'shaping' ? ' is-selected' : ''}`}
                      aria-pressed={nestGate === 'shaping'}
                      onClick={() => {
                        setNestGate('shaping')
                        setObsessionOpen(true)
                      }}
                    >
                      Still shaping it
                    </RippleButton>
                  </div>
                  {nestGate === 'kept' && (
                    <p className="nest-gate__status" role="status">
                      Saved locally. Self-tested only ... no users, no launch claim.
                    </p>
                  )}
                  {nestGate === 'shaping' && (
                    <p className="nest-gate__status" role="status">
                      Honest answer. Tweak the obsession until it feels like you.
                    </p>
                  )}
                </div>

                <div className="nest-gate__meta">
                  <div>
                    <strong>
                      <AnimatedCounter value={matches.size} />
                    </strong>
                    <span>Sandbox waddles</span>
                  </div>
                  <div>
                    <strong>
                      <AnimatedCounter
                        value={quacks.filter((q) => q.authorId === CURRENT_USER.id).length}
                      />
                    </strong>
                    <span>Your quacks</span>
                  </div>
                </div>

                <RippleButton
                  variant="primary"
                  className="quack-btn quack-btn--primary profile-slide__edit"
                  onClick={() => setObsessionOpen(true)}
                >
                  Edit obsession ✨
                </RippleButton>
              </article>
            )}
          </section>

          {activeDeck && deckTotal > 0 && (
            <DeckNav
              index={activeDeck.index}
              total={deckTotal}
              onPrev={activeDeck.goPrev}
              onNext={activeDeck.goNext}
              onGoTo={activeDeck.goTo}
            />
          )}
        </main>

        <aside className="quack-sidebar" aria-label="Pond extras">
          <Suspense
            fallback={
              <div className="breadcrumb-game breadcrumb-game--loading" aria-busy="true">
                <p className="breadcrumb-game__loading">Loading the crumb pond...</p>
              </div>
            }
          >
            <BreadcrumbGame />
          </Suspense>

          <section className="sidebar-panel sidebar-panel--accent" aria-labelledby="trending-heading">
            <h2 id="trending-heading">Sample pond tags</h2>
            <ul className="trend-list">
              {TRENDING_TOPICS.map((topic) => (
                <li key={topic.tag}>
                  <RippleButton
                    className="trend-item"
                    onClick={() => showToast('Sample tag. Local sandbox, not a live feed.')}
                  >
                    <span className="trend-item__tag">{withCjkLang(topic.tag)}</span>
                    <span className="trend-item__count">{topic.posts} · sample</span>
                  </RippleButton>
                </li>
              ))}
            </ul>
          </section>

          <section className="sidebar-panel" aria-labelledby="features-heading">
            <h2 id="features-heading">What this proves</h2>
            <ul className="feature-list">
              <li>🦆 Swipe craft on a fake deck (pass, waddle, super)</li>
              <li>✨ Nest gate ... would you keep this profile?</li>
              <li>⌨️ Keyboard arrows, skip link, 44px taps, reduced motion</li>
              <li>💬 Compose a quack that stays in localStorage</li>
            </ul>
          </section>

          <footer className="quack-sidebar__footer">
            <p>
              <strong>Jade Zhao</strong> · portfolio sandbox · self-tested only
            </p>
            <p>
              <a href="https://jadexzhao.github.io/jadexzhao/">briefcase</a>
              {' · '}
              <a href="https://jlzhao.pages.iu.edu/resume.pdf" rel="noopener noreferrer">resume</a>
              {' · '}
              <a href="https://github.com/jadexzhao/jadexzhao/tree/main/duck-farm">source</a>
            </p>
          </footer>
        </aside>
      </div>

      <nav className="quack-mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`quack-mobile-nav__item${activeNav === id ? ' is-active' : ''}`}
            aria-current={activeNav === id ? 'page' : undefined}
            aria-label={label}
            onClick={() => handleNavChange(id)}
          >
            <Icon />
            <span className="quack-mobile-nav__label">{label}</span>
          </button>
        ))}
      </nav>

      <div className={`quack-toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>

      <MatchModal
        profile={matchModal?.profile ?? null}
        superQuack={matchModal?.superQuack}
        onClose={() => setMatchModal(null)}
      />

      <ObsessionEditor
        open={obsessionOpen}
        value={obsession}
        onSave={setObsession}
        onClose={() => setObsessionOpen(false)}
      />
    </div>
  )
}
