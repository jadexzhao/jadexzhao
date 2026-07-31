interface EmptyStateProps {
  emoji: string
  title: string
  message: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ emoji, title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state__emoji" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      {action && (
        <button type="button" className="quack-btn quack-btn--primary empty-state__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
