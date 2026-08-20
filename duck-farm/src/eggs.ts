/** duck-farm · pond-side door hints */
export function initDoorEggs(): void {
  const green = '#3f5b3f'
  console.log(
    '%c🦆 jadewowgreen · Quackr sandbox · other doors: matcha · phoenix',
    `color:${green};font-size:13px;font-weight:600`,
  )
  console.log(
    '%ctype matcha or phoenix anywhere (not in a text field)',
    `color:${green};font-size:11px`,
  )

  const doors: Record<string, { label: string; url: string }> = {
    matcha: {
      label: 'Cookie classroom',
      url: 'https://matchaxmoxie.github.io/matchaxmoxie/',
    },
    phoenix: {
      label: 'Essays & notes',
      url: 'https://zhao-langxi.github.io/zhao-langxi/',
    },
  }

  let buffer = ''
  const fired: Record<string, boolean> = {}

  const showToast = (key: string) => {
    const door = doors[key]
    if (!door) return
    let el = document.getElementById('door-egg-toast')
    if (!el) {
      el = document.createElement('p')
      el.id = 'door-egg-toast'
      el.className = 'door-egg-toast'
      el.setAttribute('role', 'status')
      el.setAttribute('aria-live', 'polite')
      document.body.appendChild(el)
    }
    el.innerHTML = `${door.label} · <a href="${door.url}" rel="noopener noreferrer">${door.url.replace(/^https:\/\//, '')}</a>`
    el.hidden = false
    el.classList.add('is-visible')
    window.setTimeout(() => {
      el.classList.remove('is-visible')
      window.setTimeout(() => {
        el.hidden = true
      }, 280)
    }, 3200)
  }

  const fireOnce = (key: string) => {
    if (fired[key]) return
    fired[key] = true
    showToast(key)
    window.setTimeout(() => {
      fired[key] = false
    }, 4000)
  }

  const isTypingContext = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false
    const tag = target.tagName.toLowerCase()
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
    return target.isContentEditable
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (isTypingContext(e.target)) return
    if (e.key.length !== 1) return
    buffer = (buffer + e.key.toLowerCase()).slice(-24)
    Object.keys(doors).forEach((word) => {
      if (buffer.endsWith(word)) fireOnce(word)
    })
  })
}
