import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { resources } from '@/data/mock'
import { Card, Button } from '@/components/ui'

export function Resources() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-display text-[var(--text-primary)] mb-2">Resources</h1>
        <p className="text-body text-[var(--text-muted)]">Guides, documentation, and FAQs to get the most out of DevBrain AI.</p>
      </div>

      <section className="mb-16">
        <h2 className="text-h2 text-[var(--text-primary)] mb-6">Guides & Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={r.href}
                className="block rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--accent-primary)]/50 transition-colors h-full"
              >
                <span className="text-2xl mb-3 block">{r.icon}</span>
                <span className="text-xs font-medium text-[var(--accent-primary)]">{r.type}</span>
                <h3 className="text-h3 text-[var(--text-primary)] mt-2 mb-2">{r.title}</h3>
                <p className="text-small text-[var(--text-muted)]">{r.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="demo">
        <h2 className="text-h2 text-[var(--text-primary)] mb-6">Hackathon Demo Guide</h2>
        <Card className="p-6">
          <p className="text-body text-[var(--text-muted)] mb-4">
            Quick demo flow for judges: (1) Open the app and run Demo Mode to create sample sources. (2) Wait for sync in Tasks. (3) Try Unified Search and Chat. (4) Show Knowledge Cards and Settings.
          </p>
          <Link to="/auth/login">
            <Button variant="secondary" size="md">Go to App →</Button>
          </Link>
        </Card>
      </section>
    </div>
  )
}
