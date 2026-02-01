import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { getStoredUser, setStoredUser, isAdmin, logOut } from '@/lib/auth'
import { getTheme, toggleTheme } from '@/lib/theme'
import { useAppMode } from '@/context/AppModeContext'
import { hasApiBaseUrl } from '@/adapters'
import { ApiBanner } from '@/components/ApiBanner'

const appNav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/app/sources', label: 'Sources', icon: '📚' },
  { to: '/app/search', label: 'Search', icon: '🔍' },
  { to: '/app/chat', label: 'Chat', icon: '💬' },
  { to: '/app/cards', label: 'Knowledge Cards', icon: '📌' },
  { to: '/app/tasks', label: 'Tasks', icon: '⚙️' },
  { to: '/app/settings', label: 'Settings', icon: '🔧' },
  { to: '/app/profile', label: 'Profile', icon: '👤' },
]
const adminNavItem = { to: '/admin/dashboard', label: 'Admin', icon: '🛡️' }

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { mode } = useAppMode()
  const [user, setUser] = useState(getStoredUser())
  const [theme, setThemeState] = useState(getTheme())
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const isProductionNoApi = mode === 'PRODUCTION' && !hasApiBaseUrl()
  const modeBadgeLabel = mode === 'DEMO' ? 'DEMO' : mode === 'PRODUCTION' ? 'Production' : 'Current'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = async () => {
    try {
      await logOut()
      setUser(null)
      setProfileOpen(false)
      navigate('/auth/login')
    } catch (error) {
      // Even if logout fails, clear local state and redirect
      setStoredUser(null)
      setUser(null)
      setProfileOpen(false)
      navigate('/auth/login')
    }
  }

  if (isProductionNoApi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-primary)]">
        <div className="max-w-md w-full rounded-2xl border-2 border-[var(--error)]/50 bg-[var(--bg-secondary)] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--error)]/20 flex items-center justify-center text-3xl mx-auto mb-4">⚠️</div>
          <h1 className="text-h2 text-[var(--text-primary)] mb-2">Production Mode requires API</h1>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">VITE_API_BASE_URL</code> is not set.
            Set it in <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">.env</code> to your Ragpi backend URL and restart the dev server.
          </p>
          <Link to="/app/profile">
            <Button variant="secondary">Switch mode in Profile</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      <aside className="hidden lg:flex flex-col w-[var(--sidebar-width)] border-r border-[var(--border)] bg-[var(--bg-secondary)] shrink-0">
        <div className="p-4 border-b border-[var(--border)]">
          <Link to="/app/dashboard" className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
            <span className="bg-[var(--accent-gradient)] bg-clip-text text-transparent">DevBrain</span>
            <span className="text-[var(--text-muted)]">AI</span>
          </Link>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {appNav.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === to || (to !== '/app/dashboard' && location.pathname.startsWith(to))
                  ? 'bg-[var(--bg-tertiary)] text-[var(--accent-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
          {isAdmin() && (
            <Link
              to={adminNavItem.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] border-t border-[var(--border)] mt-2 pt-2"
            >
              <span>{adminNavItem.icon}</span>
              {adminNavItem.label}
            </Link>
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[var(--topbar-height)] border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-between px-4 gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-muted)] text-sm w-full max-w-md"
          >
            <span>🔍</span>
            <span>Search...</span>
            <span className="ml-auto text-xs">Ctrl+K</span>
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                mode === 'DEMO'
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : mode === 'PRODUCTION'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
              }`}
              title={`Application mode: ${modeBadgeLabel}`}
            >
              {modeBadgeLabel}
            </span>
            <button type="button" className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]" title="Notifications">
              🔔
            </button>
            <button
              type="button"
              onClick={() => setThemeState(toggleTheme())}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]"
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--bg-tertiary)]"
              >
                <span className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-sm font-medium text-[var(--accent-primary)]">
                  {user?.name?.slice(0, 1) ?? 'U'}
                </span>
                <span className="text-sm text-[var(--text-primary)] hidden sm:inline">{user?.name ?? 'User'}</span>
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg py-2 z-20">
                    <Link to="/app/profile" className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]" onClick={() => setProfileOpen(false)}>
                      Profile
                    </Link>
                    <button type="button" onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-[var(--error)] hover:bg-[var(--bg-tertiary)]">
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <ApiBanner />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/50" onClick={() => setSearchOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Search sources, chat..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              autoFocus
            />
            <p className="text-small text-[var(--text-muted)] mt-2">Press Esc to close. Go to Search or Chat for full experience.</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => { navigate('/app/search'); setSearchOpen(false); }}>Open Search</Button>
              <Button size="sm" variant="secondary" onClick={() => { navigate('/app/chat'); setSearchOpen(false); }}>Open Chat</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
