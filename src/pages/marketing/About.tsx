import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { team } from '@/data/mock'
import { IMAGES } from '@/data/mock'
import { Button } from '@/components/ui'

export function About() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <section className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] mb-16">
        <img src={IMAGES.team} alt="Team collaboration" className="w-full h-64 sm:h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-display text-[var(--text-primary)] mb-2">
            About DevBrain AI
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-body text-[var(--text-secondary)] max-w-2xl">
            Our mission is to reduce the time developers waste searching across fragmented tools.
          </motion.p>
        </div>
      </section>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-body text-[var(--text-muted)] mb-12">
        DevBrain AI unifies documentation, code repos, issue trackers, and chat logs into one AI-powered hub with traceable answers—built for hackathon S4.
      </motion.p>

      <section className="mb-16">
        <h2 className="text-h2 text-[var(--text-primary)] mb-6">Why DevBrain AI</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body text-[var(--text-muted)]">
          {['One place for all technical knowledge', 'Semantic search across sources', 'AI chat with citations you can trust', 'Faster onboarding for new team members'].map((item, i) => (
            <motion.li key={item} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-xs font-bold text-[var(--accent-primary)] shrink-0">✓</span>
              {item}
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="text-h2 text-[var(--text-primary)] mb-6">Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-center hover:border-[var(--accent-primary)]/30 transition-colors"
            >
              <span className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-xl font-bold text-[var(--accent-primary)] mx-auto mb-3">
                {member.avatar}
              </span>
              <h3 className="text-h3 text-[var(--text-primary)]">{member.name}</h3>
              <p className="text-small text-[var(--text-muted)]">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8 mb-12">
        <h2 className="text-h2 text-[var(--text-primary)] mb-4">Vision</h2>
        <p className="text-body text-[var(--text-muted)] mb-6">
          We believe every developer should have instant access to the right knowledge, with full traceability. DevBrain AI is built for hackathon S4: solving the fragmentation of technical knowledge across development tools.
        </p>
        <Link to="/contact">
          <Button variant="secondary" size="md">Get in touch</Button>
        </Link>
      </section>
    </div>
  )
}
