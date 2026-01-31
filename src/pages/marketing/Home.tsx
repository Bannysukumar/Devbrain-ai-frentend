import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { features, howItWorks, testimonials, screenshotItems } from '@/data/mock'

export function Home() {
  return (
    <div>
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent-primary)]/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-display sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6"
          >
            Unified AI Knowledge Hub for Developers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10"
          >
            Solve S4: Stop searching across docs, code, issues, and chats. One place. AI-powered search and chat with citations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/auth/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="secondary">Request Demo</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h1 text-[var(--text-primary)] text-center mb-4">Problem → Solution</h2>
          <p className="text-body text-[var(--text-muted)] text-center max-w-2xl mx-auto mb-12">
            Technical knowledge is fragmented across tools (S4). DevBrain AI unifies docs, code, issues, and chats into one searchable, AI-powered hub with traceable answers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--accent-primary)]/50 transition-colors"
              >
                <span className="text-2xl mb-3 block">{f.icon}</span>
                <h3 className="text-h3 text-[var(--text-primary)] mb-2">{f.title}</h3>
                <p className="text-small text-[var(--text-muted)]">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h1 text-[var(--text-primary)] text-center mb-12">How it works</h2>
          <div className="space-y-8">
            {howItWorks.map((step) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start"
              >
                <span className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-bold flex items-center justify-center shrink-0">
                  {step.step}
                </span>
                <div>
                  <h3 className="text-h3 text-[var(--text-primary)] mb-1">{step.title}</h3>
                  <p className="text-body text-[var(--text-muted)]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h1 text-[var(--text-primary)] text-center mb-4">See it in action</h2>
          <p className="text-body text-[var(--text-muted)] text-center max-w-2xl mx-auto mb-12">
            One hub for docs, code, issues, and chat—with AI-powered search and citations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {screenshotItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden shadow-lg hover:border-[var(--accent-primary)]/30 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-video object-cover"
                />
                <p className="p-4 text-small font-medium text-[var(--text-primary)]">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h1 text-[var(--text-primary)] text-center mb-12">What people say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6"
              >
                <p className="text-body text-[var(--text-secondary)] mb-4">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-sm font-medium text-[var(--accent-primary)]">
                    {t.avatar}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{t.author}</p>
                    <p className="text-small text-[var(--text-muted)]">{t.role}, {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-h1 text-[var(--text-primary)] mb-4">Ready to unify your knowledge?</h2>
          <p className="text-body text-[var(--text-muted)] mb-8">Get started in minutes. No credit card required.</p>
          <Link to="/auth/signup">
            <Button size="lg">Start Free</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
