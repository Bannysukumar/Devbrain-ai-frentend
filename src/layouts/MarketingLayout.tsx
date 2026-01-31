import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/resources', label: 'Resources' },
  { to: '/contact', label: 'Contact' },
  { to: '/pricing', label: 'Pricing' },
]

const footerLinks = [
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/resources', label: 'Resources' },
  { to: '/contact', label: 'Contact' },
  { to: '/pricing', label: 'Pricing' },
]

export function MarketingLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
              <span className="bg-[var(--accent-gradient)] bg-clip-text text-transparent">DevBrain</span>
              <span className="text-[var(--text-muted)]">AI</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {nav.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === to ? 'text-[var(--accent-primary)] bg-[var(--bg-tertiary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/auth/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="font-bold text-[var(--text-primary)]">DevBrain AI</Link>
              <p className="text-small text-[var(--text-muted)] mt-2">Unified AI knowledge hub for developers.</p>
            </div>
            <div className="md:col-span-3 flex flex-wrap gap-8">
              {footerLinks.map(({ to, label }) => (
                <Link key={to} to={to} className="text-small text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[var(--border)] text-small text-[var(--text-muted)]">
            © {new Date().getFullYear()} DevBrain AI. Hackathon project.
          </div>
        </div>
      </footer>
    </div>
  )
}
