import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  message: ReactNode
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state__pond" aria-hidden="true" />
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__message">{message}</p>
      {action && (
        <button type="button" className="quack-btn quack-btn--primary empty-state__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
