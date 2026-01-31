import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-small text-[var(--text-muted)]" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-[var(--border)]">/</span>}
          {item.href ? (
            <Link to={item.href} className="hover:text-[var(--text-primary)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text-primary)] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
