import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getStoredUser } from '@/lib/auth'
import { useAppMode } from '@/context/AppModeContext'
import type { AppMode } from '@/lib/mode'
import { Button, Card, CardHeader, Breadcrumb, Modal } from '@/components/ui'

const MODE_OPTIONS: { value: AppMode; label: string; description: string }[] = [
  { value: 'CURRENT', label: 'Current', description: 'Use live API (VITE_API_BASE_URL). No auto-seeding. Default behavior.' },
  { value: 'DEMO', label: 'Demo', description: 'Judge-ready: sample data, guided demo, works offline with local dataset.' },
  { value: 'PRODUCTION', label: 'Production', description: 'Real usage: live sources only, confirmations for destructive actions, stricter defaults.' },
]

export function Profile() {
  const user = getStoredUser()
  const { mode, setMode } = useAppMode()
  const [selectedMode, setSelectedMode] = useState<AppMode>(mode)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleApplyMode = () => {
    if (selectedMode === mode) {
      setConfirmOpen(false)
      return
    }
    setConfirmOpen(true)
  }

  const confirmApply = () => {
    setMode(selectedMode)
    setConfirmOpen(false)
  }

  if (!user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto py-12">
        <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Profile' }]} />
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center text-3xl text-[var(--text-muted)] mx-auto mb-4">
            👤
          </div>
          <h2 className="text-h2 text-[var(--text-primary)] mb-2">Not logged in</h2>
          <p className="text-[var(--text-muted)] mb-6">Sign in to view your profile and preferences.</p>
          <Link to="/auth/login">
            <Button size="lg">Log in</Button>
          </Link>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto space-y-8">
      <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Profile' }]} />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[var(--accent-gradient)] opacity-[0.05]" aria-hidden />
        <div className="relative flex flex-wrap items-center gap-6">
          <span className="w-20 h-20 rounded-2xl bg-[var(--accent-primary)]/20 flex items-center justify-center text-3xl font-bold text-[var(--accent-primary)] shrink-0">
            {(user.name?.slice(0, 1) ?? 'U').toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-display text-[var(--text-primary)]">Profile</h1>
            <p className="text-body text-[var(--text-muted)] mt-1">{user.email}</p>
            <p className="text-small text-[var(--text-muted)] mt-2">Your account details and preferences</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Application mode"
          description="Switch between Current (live API), Demo (sample data / judge-ready), or Production (real-world)."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedMode(opt.value)}
              className={`text-left p-4 rounded-xl border-2 transition-colors ${
                selectedMode === opt.value
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                  : 'border-[var(--border)] bg-[var(--bg-tertiary)]/30 hover:border-[var(--text-muted)]'
              }`}
            >
              <span className="font-semibold text-[var(--text-primary)]">{opt.label}</span>
              <p className="text-small text-[var(--text-muted)] mt-1">{opt.description}</p>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button size="md" onClick={handleApplyMode}>
            Apply mode
          </Button>
          {selectedMode !== mode && (
            <span className="text-small text-[var(--text-muted)]">Current: {mode}</span>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Account" description="Your account details." />
          <dl className="space-y-4">
            <div>
              <dt className="text-small text-[var(--text-muted)] font-medium">Name</dt>
              <dd className="text-body text-[var(--text-primary)] mt-1">{user.name}</dd>
            </div>
            <div>
              <dt className="text-small text-[var(--text-muted)] font-medium">Email</dt>
              <dd className="text-body text-[var(--text-primary)] mt-1">{user.email}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <CardHeader title="Security" description="Password and account security." />
          <p className="text-small text-[var(--text-muted)] mb-4">
            In production this would open a change-password or two-factor flow.
          </p>
          <Button variant="secondary" size="md" disabled>Change password</Button>
        </Card>
      </div>

      <Card>
        <CardHeader title="Quick links" description="Shortcuts to key areas." />
        <div className="flex flex-wrap gap-3">
          <Link to="/app/settings">
            <Button variant="secondary" size="md">Settings</Button>
          </Link>
          <Link to="/app/dashboard">
            <Button variant="ghost" size="md">Dashboard</Button>
          </Link>
          <Link to="/app/sources">
            <Button variant="ghost" size="md">Sources</Button>
          </Link>
        </div>
      </Card>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm mode change" size="sm">
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            Switch to <strong>{selectedMode}</strong>? The app will reload behavior for this mode.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmApply}>Apply</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
