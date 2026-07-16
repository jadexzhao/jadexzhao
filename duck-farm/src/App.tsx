import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'

interface Duck {
  id: number
  x: number
  y: number
  angle: number
  vx: number
  vy: number
  accessory?: string
}

const ACCESSORIES = ['💼', '🍵', '👷‍♀️']
const getRandomAccessory = () =>
  Math.random() > 0.7
    ? ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)]
    : undefined

function makeDuck(id: number, x: number, y: number, angle: number, vx: number): Duck {
  return { id, x, y, angle, vx, vy: 0, accessory: getRandomAccessory() }
}

function initialDucks(): Duck[] {
  return [
    makeDuck(1, 20, 60, 0, 1),
    makeDuck(2, 70, 70, 180, -0.8),
  ]
}

function duckCssTransform(
  duck: Duck,
  canvasW: number,
  canvasH: number,
  reduceMotion = false,
): string {
  const x = (duck.x / 100) * canvasW
  const y = (duck.y / 100) * canvasH
  const bob =
    reduceMotion || duck.x > 50
      ? 0
      : Math.sin(Date.now() * 0.003 + duck.id) * 2
  const flip = duck.angle === 180 ? ' scaleX(-1)' : ''
  return `translate3d(${x}px, ${y + bob}px, 0)${flip}`
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function App() {
  const ducksRef = useRef<Duck[]>(initialDucks())
  const nextIdRef = useRef(3)
  const duckElsRef = useRef<Map<number, HTMLDivElement>>(new Map())
  const canvasRef = useRef<HTMLDivElement>(null)
  const canvasSizeRef = useRef({ w: 0, h: 0 })
  const animationRef = useRef<number>()
  const toastTimerRef = useRef<number>()
  const fpsFramesRef = useRef(0)
  const fpsLastRef = useRef(performance.now())
  const fpsElRef = useRef<HTMLSpanElement | null>(null)
  const overrideDayRef = useRef(false)
  const reduceMotionRef = useRef(prefersReducedMotion())

  const [duckList, setDuckList] = useState<Duck[]>(() => [...ducksRef.current])
  const [duckCount, setDuckCount] = useState(2)
  const [isDay, setIsDay] = useState(() => {
    const h = new Date().getHours()
    return h >= 6 && h < 18
  })
  const [toast, setToast] = useState<string | null>(null)
  const [showDev, setShowDev] = useState(false)

  const syncDuckList = useCallback(() => {
    setDuckList(ducksRef.current.map((d) => ({ ...d })))
    setDuckCount(ducksRef.current.length)
  }, [])

  const measureCanvas = useCallback(() => {
    const el = canvasRef.current
    if (!el) return
    canvasSizeRef.current = { w: el.clientWidth, h: el.clientHeight }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      reduceMotionRef.current = mq.matches
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const checkTime = () => {
      if (overrideDayRef.current) return
      const hours = new Date().getHours()
      setIsDay(hours >= 6 && hours < 18)
    }
    checkTime()
    const interval = setInterval(checkTime, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('night-farm', !isDay)
    return () => document.body.classList.remove('night-farm')
  }, [isDay])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    measureCanvas()
    const ro = new ResizeObserver(() => {
      measureCanvas()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [measureCanvas])

  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a',
    ]
    let konamiIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
          const startId = nextIdRef.current
          const newDucks: Duck[] = []
          for (let i = 0; i < 50; i++) {
            newDucks.push({
              id: startId + i,
              x: Math.random() * 80 + 10,
              y: 65 + Math.random() * 15,
              angle: Math.random() > 0.5 ? 0 : 180,
              vx: (Math.random() - 0.5) * 4,
              vy: -Math.random() * 2,
              accessory: getRandomAccessory(),
            })
          }
          nextIdRef.current = startId + 50
          ducksRef.current = [...ducksRef.current, ...newDucks]
          syncDuckList()
          setToast('50 ducks. you earned this.')
          if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
          toastTimerRef.current = window.setTimeout(() => setToast(null), 2400)
          konamiIndex = 0
        }
      } else {
        konamiIndex = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    }
  }, [syncDuckList])

  useEffect(() => {
    const animate = () => {
      const ducks = ducksRef.current
      const { w: canvasW, h: canvasH } = canvasSizeRef.current
      const reduce = reduceMotionRef.current

      for (let i = 0; i < ducks.length; i++) {
        const duck = ducks[i]
        if (!reduce) {
          let newVy = duck.vy
          if (duck.y < 65) newVy += 0.05

          let newX = duck.x + duck.vx
          let newY =
            duck.y +
            newVy +
            (duck.x > 50 ? 0 : Math.sin(Date.now() * 0.003 + duck.id) * 0.1)
          let newAngle = duck.angle

          if (newX < 0 || newX > 90) {
            newAngle = newAngle === 0 ? 180 : 0
            newX = newX < 0 ? 0 : 90
            duck.vx = Math.abs(duck.vx) * (newAngle === 180 ? -1 : 1)
          }

          if (newY >= 65) {
            newY = 65
            newVy = 0
          }

          duck.x = newX
          duck.y = newY
          duck.angle = newAngle
          duck.vy = newVy
        }

        const el = duckElsRef.current.get(duck.id)
        if (el && canvasW > 0 && canvasH > 0) {
          el.style.transform = duckCssTransform(duck, canvasW, canvasH, reduce)
        }
      }

      fpsFramesRef.current += 1
      const now = performance.now()
      if (now - fpsLastRef.current >= 1000) {
        const nextFps = fpsFramesRef.current
        fpsFramesRef.current = 0
        fpsLastRef.current = now
        if (fpsElRef.current) fpsElRef.current.textContent = `${nextFps} fps`
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const setDuckEl = useCallback((id: number, node: HTMLDivElement | null) => {
    if (node) duckElsRef.current.set(id, node)
    else duckElsRef.current.delete(id)
  }, [])

  const bounceDuck = (id: number) => {
    const duck = ducksRef.current.find((d) => d.id === id)
    if (!duck) return
    duck.vx *= -1
    duck.vy = -0.5
    const el = duckElsRef.current.get(id)
    if (el) {
      el.classList.remove('clicked')
      void el.offsetWidth
      el.classList.add('clicked')
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    if (y <= 60) return

    const id = nextIdRef.current++
    const duck: Duck = {
      id,
      x,
      y,
      angle: Math.random() > 0.5 ? 0 : 180,
      vx: (Math.random() - 0.5) * 2,
      vy: 0,
      accessory: getRandomAccessory(),
    }
    ducksRef.current = [...ducksRef.current, duck]
    syncDuckList()
  }

  const handleDuckClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    const audio = new Audio(
      'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
    )
    audio.play().catch(() => {})
    bounceDuck(id)
  }

  const handleDuckKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      bounceDuck(id)
    }
  }

  const clearFarm = () => {
    ducksRef.current = []
    nextIdRef.current = 1
    syncDuckList()
  }

  const resetFarm = () => {
    ducksRef.current = initialDucks()
    nextIdRef.current = 3
    syncDuckList()
  }

  const populateFarm = () => {
    const startId = nextIdRef.current
    const newDucks: Duck[] = []
    for (let i = 0; i < 8; i++) {
      newDucks.push({
        id: startId + i,
        x: Math.random() * 80 + 10,
        y: 65 + Math.random() * 15,
        angle: Math.random() > 0.5 ? 0 : 180,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        accessory: getRandomAccessory(),
      })
    }
    nextIdRef.current = startId + 8
    ducksRef.current = [...ducksRef.current, ...newDucks]
    syncDuckList()
  }

  const toggleDayNight = () => {
    overrideDayRef.current = true
    setIsDay((d) => !d)
  }

  return (
    <div className={`farm-container${isDay ? '' : ' night-mode'}`}>
      <a href="#farm-main" className="skip-link">
        skip to duck farm
      </a>

      <div className="topbar topbar--paper">
        <nav className="site-nav site-nav--on-paper" aria-label="Briefcase">
          <a href="https://jadexzhao.github.io/jadexzhao/">home</a>
          <a href="https://jadexzhao.github.io/jadexzhao/how-i-work.html">how i work</a>
          <a href="https://jadexzhao.github.io/jadexzhao/i18n-wcag.html">accessibility</a>
          <a href="https://jadexzhao.github.io/jadexzhao/duck-farm/" aria-current="page">
            duck farm
          </a>
        </nav>
      </div>

      <header className="farm-header">
        <p className="farm-eyebrow">
          <span lang="zh-Hans">鸭年</span> 2026 · live sandbox
        </p>
        <h1 className="farm-title">virtual duck farm</h1>
        <p className="farm-lede">
          Restaurant-kid wiring: ship what works. Click the grass to place a duck, tap a duck
          to bounce it, then stress-test with Konami (<em>↑↑↓↓←→←→BA</em>).
        </p>
      </header>

      <main id="farm-main">
        <section className="farm-hero" aria-labelledby="sandbox-heading">
          <h2 id="sandbox-heading" className="visually-hidden">
            the live sandbox
          </h2>
          <div
            ref={canvasRef}
            className={`farm-canvas ${isDay ? 'day' : 'night'}`}
            onClick={handleCanvasClick}
            role="application"
            aria-label="Interactive duck farm. Click the grass to place ducks."
          >
            {!isDay && <div className="stars" aria-hidden="true" />}
            <div className="cloud cloud-a" aria-hidden="true" />
            <div className="cloud cloud-b" aria-hidden="true" />
            <div className="cloud cloud-c" aria-hidden="true" />
            <div className="grass" aria-hidden="true" />
            <div className="pond" aria-hidden="true" />
            {duckList.map((duck) => {
              const { w, h } = canvasSizeRef.current
              const hasSize = w > 0 && h > 0
              return (
                <div
                  key={duck.id}
                  ref={(node) => setDuckEl(duck.id, node)}
                  className="duck"
                  style={{
                    transform: hasSize
                      ? duckCssTransform(duck, w, h)
                      : 'translate3d(0,0,0)',
                  }}
                  onClick={(e) => handleDuckClick(e, duck.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Duck ${duck.id}. Activate to bounce.`}
                  onKeyDown={(e) => handleDuckKeyDown(e, duck.id)}
                >
                  <span className="duck-sprite" aria-hidden="true">
                    🦆
                  </span>
                  {duck.accessory && (
                    <span className="accessory" aria-hidden="true">
                      {duck.accessory}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <div className="farm-hud">
          <div className="counter" aria-live="polite">
            <span>{duckCount}</span> duck{duckCount !== 1 ? 's' : ''} on the farm
          </div>

          <div className="controls">
            <button type="button" className="btn-primary" onClick={populateFarm}>
              spawn 8 ducks
            </button>
            <button type="button" className="btn-secondary" onClick={toggleDayNight}>
              {isDay ? 'night mode' : 'day mode'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetFarm}>
              reset
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setShowDev((v) => !v)}
              aria-pressed={showDev}
            >
              {showDev ? 'hide FPS' : 'dev HUD'}
            </button>
            <button type="button" className="btn-danger" onClick={clearFarm}>
              clear all
            </button>
          </div>

          {showDev && (
            <div className="dev-hud" aria-live="polite">
              <span ref={fpsElRef}>0 fps</span>
              <span aria-hidden="true"> · </span>
              <span>{duckCount} ducks</span>
              <span aria-hidden="true"> · </span>
              <span>{isDay ? 'day' : 'night'}</span>
            </div>
          )}

          <p className="info">
            <strong>Click the grass</strong> to place ducks.{' '}
            <strong>Click a duck</strong> to make it jump.
            <br />
            Stack: React + TypeScript + Vite. Positions live in a ref;{' '}
            <code>requestAnimationFrame</code> writes compositor transforms so React never
            re-renders per frame.
          </p>
        </div>

        <details className="farm-architecture">
          <summary>architecture under the grass</summary>
          <div className="arch-body">
            <ul className="arch-list">
              <li>
                <strong>State.</strong> Duck positions live in a <code>useRef</code> mutated
                inside <code>requestAnimationFrame</code>. React state only syncs when ducks
                are added, cleared, or reset. Canvas size is cached via{' '}
                <code>ResizeObserver</code>. Same fence as the{' '}
                <a href="https://jadexzhao.github.io/jadexzhao/how-i-work.html">
                  how i work
                </a>{' '}
                memo.
              </li>
              <li>
                <strong>Events.</strong> A window <code>keydown</code> listener tracks the
                Konami sequence and stamps fifty ducks when complete. Day/night follows the
                clock unless you toggle manually.
              </li>
              <li>
                <strong>Access.</strong> Ducks are keyboard-focusable (Enter / Space). Controls
                meet a 48px minimum tap target. Reduced-motion preferences pause waddle
                animation. Toast uses <code>aria-live=&quot;polite&quot;</code>.
              </li>
            </ul>

            <h3 className="arch-table-title">state engine blueprint</h3>
            <div className="table-wrap">
              <table className="arch-table">
                <caption className="visually-hidden">
                  State engine blueprint for farm interactions
                </caption>
                <thead>
                  <tr>
                    <th scope="col">interaction</th>
                    <th scope="col">trigger</th>
                    <th scope="col">mutates</th>
                    <th scope="col">React re-render?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Grid click</th>
                    <td>click grass (y &gt; 60%)</td>
                    <td>append duck to ref + list</td>
                    <td>yes (structure change)</td>
                  </tr>
                  <tr>
                    <th scope="row">Entity click</th>
                    <td>click / Enter on a duck</td>
                    <td>vx flip, slight jump (vy)</td>
                    <td>no (DOM via raf)</td>
                  </tr>
                  <tr>
                    <th scope="row">Stampede</th>
                    <td>Konami ↑↑↓↓←→←→BA</td>
                    <td>+50 ducks + toast</td>
                    <td>yes (batch append)</td>
                  </tr>
                  <tr>
                    <th scope="row">Mode toggle</th>
                    <td>day / night button</td>
                    <td>
                      <code>isDay</code> + body class
                    </td>
                    <td>yes (theme)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </details>
      </main>

      <footer className="site-footer farm-footer">
        <span className="sc" lang="zh-Hans">
          福州
        </span>{' '}
        roots · TypeScript · React · Vite · WCAG
        {' · '}
        <a href="https://jadexzhao.github.io/jadexzhao/">the briefcase</a>
        {' · '}
        <a href="https://www.linkedin.com/in/jadexzhao/">LinkedIn</a>
        {' · '}
        <a href="https://github.com/jadexzhao">GitHub</a>
        {' · '}
        <a href="https://github.com/jadexzhao/jadexzhao/tree/main/duck-farm">source</a>
        {' · '}
        IG <a href="https://instagram.com/zhao.langxi">@zhao.langxi</a>
      </footer>

      <div
        className={`farm-toast${toast ? ' visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  )
}
