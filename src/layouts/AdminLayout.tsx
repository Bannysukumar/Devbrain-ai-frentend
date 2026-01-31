import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { isAdmin } from '@/lib/auth'

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/sources', label: 'Sources', icon: '📚' },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: '📋' },
  { to: '/admin/site-content', label: 'Site Content', icon: '📝' },
  { to: '/admin/settings', label: 'Settings', icon: '🔧' },
]

export function AdminLayout() {
  const location = useLocation()

  if (!isAdmin()) {
    return <Navigate to="/app/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      <aside className="hidden lg:flex flex-col w-[var(--sidebar-width)] border-r border-[var(--border)] bg-[var(--bg-secondary)] shrink-0">
        <div className="p-4 border-b border-[var(--border)]">
          <Link to="/admin/dashboard" className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
            <span className="text-[var(--accent-primary)]">Admin</span>
            <span className="text-[var(--text-muted)]">Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {adminNav.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === to ? 'bg-[var(--bg-tertiary)] text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-[var(--border)]">
          <Link to="/app/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]">
            ← Back to App
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  )
}
