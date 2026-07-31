# Quackr — Technical Interactivity

Portfolio engineering notes for the duck-farm demo. This doc covers gesture thresholds, persistence keys, and state machines — not visual theming.

## Gesture thresholds (`useSwipeGesture`)

| Constant | Value | Role |
|---|---|---|
| `SWIPE_THRESHOLD_PX` | **60** | Minimum horizontal drag distance to advance a slide |
| `SWIPE_VELOCITY_PX_MS` | **0.35** | Flick velocity (px/ms) — short fast swipes still advance |
| `SWIPE_DIRECTION_LOCK_PX` | **12** | Movement before axis lock; vertical scroll wins below this |

**Behavior**

1. `pointerdown` starts a session; only primary button (`button === 0`).
2. After 12px movement, compare `|dx|` vs `|dy|` — horizontal wins → **direction lock** + `setPointerCapture`.
3. During drag, `translateX(dx)` on the viewport; `touch-action: pan-y` preserves vertical scroll until lock.
4. On release: advance if `|dx| ≥ 60` **or** velocity ≥ 0.35 px/ms.
5. Snap back via CSS transition when not dragging.

`prefers-reduced-motion: reduce` disables drag transforms in `SlideDeck`; arrow keys / dots still work.

## Keyboard navigation (`useKeyboardNav`)

| Key | Action |
|---|---|
| `←` / `k` | Previous slide |
| `→` / `j` | Next slide |
| `Escape` | Close match or obsession modal |

Hotkeys are suppressed while focus is in `input`, `textarea`, or `contenteditable`.

## Persistence keys (`usePersistedState`)

All keys use the `quackr:` prefix in `localStorage`:

| Key | Type | Default |
|---|---|---|
| `quackr:theme` | `'light' \| 'dark'` | OS `prefers-color-scheme` |
| `quackr:matches` | `string[]` (duck profile ids) | `['drake']` |
| `quackr:quacks` | `Quack[]` JSON | seed from `INITIAL_QUACKS` |
| `quackr:obsession` | `string` | `CURRENT_USER.obsession` |

Clear all: `clearQuackrPersistence()` (see `src/hooks/usePersistedState.ts`).

Legacy key `quack-theme` is superseded by `quackr:theme`.

## Match flow state machine

Reducer: `src/state/matchFlow.ts`

```
idle ──REQUEST_MATCH/UNMATCH──► confirming ──CONFIRM──► celebrating ──CELEBRATE_DONE──► idle
                                 │                         │
                                 └──── DISMISS / Escape ───┘
```

- **confirming**: focus-trapped modal; user confirms before mutating matches.
- **celebrating**: optimistic match already applied; auto-dismiss after 2.2s or manual close.
- `MatchModal` uses `aria-live="assertive"` for screen-reader match announcements.

## Optimistic compose

Posting a quack:

1. Immediately prepend a `pending: true` quack (`timestamp: 'sending…'`).
2. After **720ms** simulated server ack, swap id, clear `pending`, set `timestamp: 'now'`.
3. Requack/flirt disabled on pending rows.

## ARIA

- Slide decks: `role="region"`, `aria-roledescription="carousel"`, polite live region for slide index.
- Match modal: `role="dialog"`, `aria-modal="true"`, focus trap via `useFocusTrap`.
- Toasts: `role="status"`, `aria-live="polite"`.

## Build

```bash
cd duck-farm && npm run build
```

Deployed at [jadexzhao.github.io/jadexzhao/duck-farm/](https://jadexzhao.github.io/jadexzhao/duck-farm/).
