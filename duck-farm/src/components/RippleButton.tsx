import { useRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'default' | 'primary' | 'ghost'
}

export function RippleButton({
  children,
  variant = 'default',
  className = '',
  onClick,
  ...rest
}: RippleButtonProps) {
  const reduced = useReducedMotion()
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!reduced && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const ripple = document.createElement('span')
      ripple.className = 'ripple'
      const size = Math.max(rect.width, rect.height)
      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`
      btnRef.current.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove())
    }
    onClick?.(e)
  }

  return (
    <button
      ref={btnRef}
      type="button"
      className={`ripple-btn ripple-btn--${variant}${className ? ` ${className}` : ''}`}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  )
}
