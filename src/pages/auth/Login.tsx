import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import { signIn } from '@/lib/auth'
import toast from 'react-hot-toast'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    try {
      await signIn(email.trim(), password)
      toast.success('Logged in successfully.')
      navigate('/app/dashboard', { replace: true })
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to log in. Please check your credentials.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-h1 text-[var(--text-primary)]">Log in</h2>
      {error && <p className="text-small text-[var(--error)]">{error}</p>}
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-small text-[var(--text-muted)]">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-[var(--border)]" />
          Remember me
        </label>
        <Link to="/auth/forgot-password" className="text-small text-[var(--accent-primary)] hover:underline">Forgot password?</Link>
      </div>
      <Button type="submit" className="w-full" size="lg" loading={loading}>Log in</Button>
      <p className="text-small text-center text-[var(--text-muted)]">
        Don&apos;t have an account? <Link to="/auth/signup" className="text-[var(--accent-primary)] hover:underline">Sign up</Link>
      </p>
    </form>
  )
}
