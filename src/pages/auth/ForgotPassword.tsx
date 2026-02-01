import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import { resetPassword } from '@/lib/auth'
import toast from 'react-hot-toast'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    setLoading(true)
    try {
      await resetPassword(email.trim())
      setSent(true)
      toast.success('If an account exists, we sent a reset link.')
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send reset email. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--success)]/20 flex items-center justify-center text-2xl mx-auto">✓</div>
        <h2 className="text-h1 text-[var(--text-primary)]">Check your email</h2>
        <p className="text-body text-[var(--text-muted)]">
          We sent a password reset link to <strong className="text-[var(--text-primary)]">{email}</strong> if an account exists.
        </p>
        <Link to="/auth/login">
          <Button variant="secondary" className="w-full">Back to Log in</Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-h1 text-[var(--text-primary)]">Forgot password</h2>
      <p className="text-small text-[var(--text-muted)]">Enter your email and we&apos;ll send a reset link.</p>
      {error && <p className="text-small text-[var(--error)]">{error}</p>}
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
      <Button type="submit" className="w-full" size="lg" loading={loading}>Send reset link</Button>
      <Link to="/auth/login" className="block text-center text-small text-[var(--accent-primary)] hover:underline">Back to Log in</Link>
    </form>
  )
}
