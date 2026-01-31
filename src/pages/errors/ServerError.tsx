import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

export function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-8xl font-bold text-[var(--error)]">500</h1>
        <h2 className="text-h1 text-[var(--text-primary)] mt-4">Something went wrong</h2>
        <p className="text-body text-[var(--text-muted)] mt-2 mb-8 max-w-md mx-auto">
          We&apos;re sorry. An unexpected error occurred. Please try again later.
        </p>
        <Link to="/">
          <Button size="lg">Go home</Button>
        </Link>
      </motion.div>
    </div>
  )
}
