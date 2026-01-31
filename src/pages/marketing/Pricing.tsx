import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { pricingPlans } from '@/data/mock'

export function Pricing() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-display text-[var(--text-primary)] mb-2">Pricing</h1>
        <p className="text-body text-[var(--text-muted)] max-w-xl mx-auto">
          Simple plans for teams of all sizes. Start free and upgrade when you need more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {pricingPlans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border p-6 flex flex-col ${
              plan.highlighted ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 shadow-lg md:scale-105' : 'border-[var(--border)] bg-[var(--bg-secondary)]'
            }`}
          >
            <h3 className="text-h2 text-[var(--text-primary)] mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-[var(--text-primary)]">{plan.price}</span>
              <span className="text-[var(--text-muted)]">{plan.period}</span>
            </div>
            <p className="text-small text-[var(--text-muted)] mb-6">{plan.description}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-small text-[var(--text-secondary)]">
                  <span className="text-[var(--success)]">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to={plan.name === 'Free' ? '/auth/signup' : '/contact'} className="mt-auto">
              <Button variant={plan.highlighted ? 'primary' : 'secondary'} size="lg" className="w-full">
                {plan.cta}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
