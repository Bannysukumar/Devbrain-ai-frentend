import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import toast from 'react-hot-toast'

export function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setDone(true)
    toast.success('Password updated.')
    setLoading(false)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-h1 text-[var(--text-primary)]">Reset password</h2>
      <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
      <Input label="Confirm new password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required />
      {confirm && password !== confirm && <p className="text-small text-[var(--error)]">Passwords do not match.</p>}
      <Button type="submit" className="w-full" size="lg" loading={loading} disabled={password !== confirm}>Update password</Button>
      <Link to="/auth/login" className="block text-center text-small text-[var(--accent-primary)] hover:underline">Back to Log in</Link>
    </form>
  )
}
