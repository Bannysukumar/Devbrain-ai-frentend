import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-8xl font-bold text-[var(--text-muted)]">404</h1>
        <h2 className="text-h1 text-[var(--text-primary)] mt-4">Page not found</h2>
        <p className="text-body text-[var(--text-muted)] mt-2 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">Go home</Button>
        </Link>
      </motion.div>
    </div>
  )
}
