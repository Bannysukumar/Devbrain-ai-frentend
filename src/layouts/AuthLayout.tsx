import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[var(--accent-primary)]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[var(--accent-secondary)]/20 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[var(--shadow-lg)] p-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-[var(--text-primary)] mb-6">
            <span className="bg-[var(--accent-gradient)] bg-clip-text text-transparent">DevBrain</span>
            <span className="text-[var(--text-muted)]">AI</span>
          </Link>
          <Outlet />
        </div>
      </motion.div>
    </div>
  )
}
