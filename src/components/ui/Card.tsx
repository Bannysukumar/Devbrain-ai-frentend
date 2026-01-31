import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

export function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
  const Wrapper = hover ? motion.div : 'div'
  const wrapperProps = hover
    ? { whileHover: { y: -2 }, transition: { duration: 0.2 }, className: 'cursor-pointer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`
        rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[var(--shadow)]
        ${paddingMap[padding]} ${className}
      `}
    >
      {children}
    </Wrapper>
  )
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="text-h2 text-[var(--text-primary)]">{title}</h2>
        {description && <p className="text-small text-[var(--text-muted)] mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}
