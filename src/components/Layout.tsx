import { Link, useLocation } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/sources', label: 'Sources' },
  { to: '/search', label: 'Search' },
  { to: '/chat', label: 'Chat' },
  { to: '/cards', label: 'Knowledge Cards' },
  { to: '/settings', label: 'Settings' },
  { to: '/health', label: 'Health' },
  { to: '/tasks', label: 'Tasks' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="border-b border-slate-700 bg-slate-800/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-slate-100 font-semibold">
              <span className="text-accent-blue">DevBrain</span>
              <span className="text-slate-400">AI</span>
            </Link>
            <nav className="flex items-center gap-1 overflow-x-auto">
              {nav.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
                      ? 'bg-slate-700 text-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
