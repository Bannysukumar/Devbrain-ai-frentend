import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import { signUp } from '@/lib/auth'
import toast from 'react-hot-toast'

function passwordStrength(p: string): number {
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}

export function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const strength = passwordStrength(password)
  const match = !password || !confirm || password === confirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!acceptTerms) {
      setError('Please accept the terms.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (strength < 2) {
      setError('Use a stronger password (8+ chars, mix of letters and numbers).')
      return
    }
    
    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    setLoading(true)
    try {
      await signUp(name.trim(), email.trim(), password)
      toast.success('Account created successfully.')
      navigate('/app/dashboard', { replace: true })
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create account. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-h1 text-[var(--text-primary)]">Sign up</h2>
      {error && <p className="text-small text-[var(--error)]">{error}</p>}
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
      <div>
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? (strength <= 2 ? 'bg-[var(--error)]' : 'bg-[var(--success)]') : 'bg-[var(--bg-tertiary)]'}`} />
          ))}
        </div>
      </div>
      <Input label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required />
      {confirm && !match && <p className="text-small text-[var(--error)]">Passwords do not match.</p>}
      <label className="flex items-start gap-2 text-small text-[var(--text-muted)]">
        <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="rounded border-[var(--border)] mt-0.5" />
        I accept the terms and privacy policy.
      </label>
      <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!match || !acceptTerms}>Create account</Button>
      <p className="text-small text-center text-[var(--text-muted)]">
        Already have an account? <Link to="/auth/login" className="text-[var(--accent-primary)] hover:underline">Log in</Link>
      </p>
    </form>
  )
}
