import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-secondary)]"
    >
      <span className="text-4xl mb-4" aria-hidden>{icon}</span>
      <h3 className="text-h3 text-[var(--text-primary)] mb-2">{title}</h3>
      {description && <p className="text-body text-[var(--text-muted)] max-w-md mb-6">{description}</p>}
      {action}
    </motion.div>
  )
}
