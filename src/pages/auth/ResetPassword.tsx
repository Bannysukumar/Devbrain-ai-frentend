import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import { confirmPasswordReset } from '@/lib/auth'
import toast from 'react-hot-toast'

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const actionCode = searchParams.get('oobCode') || searchParams.get('code')

  useEffect(() => {
    if (!actionCode) {
      setError('Invalid or missing reset code. Please request a new password reset link.')
    }
  }, [actionCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!actionCode) {
      setError('Invalid or missing reset code.')
      return
    }
    
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    try {
      await confirmPasswordReset(actionCode, password)
      setDone(true)
      toast.success('Password updated successfully.')
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to reset password. The link may have expired.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-h1 text-[var(--text-primary)]">Password updated</h2>
        <p className="text-body text-[var(--text-muted)]">You can now log in with your new password.</p>
        <Link to="/auth/login">
          <Button className="w-full">Log in</Button>
        </Link>
      </div>
    )
  }

  if (!actionCode) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-h1 text-[var(--text-primary)]">Invalid reset link</h2>
        <p className="text-body text-[var(--text-muted)]">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link to="/auth/forgot-password">
          <Button className="w-full">Request new reset link</Button>
        </Link>
        <Link to="/auth/login" className="block text-center text-small text-[var(--accent-primary)] hover:underline">
          Back to Log in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-h1 text-[var(--text-primary)]">Reset password</h2>
      {error && <p className="text-small text-[var(--error)]">{error}</p>}
      <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
      <Input label="Confirm new password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required />
      {confirm && password !== confirm && <p className="text-small text-[var(--error)]">Passwords do not match.</p>}
      <Button type="submit" className="w-full" size="lg" loading={loading} disabled={password !== confirm || !actionCode}>
        Update password
      </Button>
      <Link to="/auth/login" className="block text-center text-small text-[var(--accent-primary)] hover:underline">Back to Log in</Link>
    </form>
  )
}
