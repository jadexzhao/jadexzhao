import type { ReactNode } from 'react'

/** Public doors that still exist. Résumé ships with briefcase on GitHub Pages. */
export const POND_HREFS = {
  briefcase: 'https://jadexzhao.github.io/jadexzhao/',
  wcag: 'https://jadexzhao.github.io/jadexzhao/i18n-wcag.html',
  essays: 'https://zhao-langxi.github.io/zhao-langxi/',
  resume: 'https://jadexzhao.github.io/jadexzhao/resume.pdf',
  source: 'https://github.com/jadexzhao/jadexzhao/tree/main/duck-farm',
} as const

export function PondLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="pond-link" rel="noopener noreferrer">
      {children}
    </a>
  )
}

export function DoorTrail() {
  return (
    <p className="pond-door-trail">
      <PondLink href={POND_HREFS.briefcase}>jadexzhao</PondLink>
      {' · '}
      <PondLink href={POND_HREFS.essays}>zhao-langxi</PondLink>
      {' · '}
      <PondLink href={POND_HREFS.source}>source</PondLink>
    </p>
  )
}
