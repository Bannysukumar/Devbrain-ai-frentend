import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Input, Card } from '@/components/ui'
import toast from 'react-hot-toast'
import { IMAGES } from '@/data/mock'

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Message sent! We\'ll get back to you soon.')
    setName('')
    setEmail('')
    setMessage('')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-display text-[var(--text-primary)] mb-2">Contact</h1>
        <p className="text-body text-[var(--text-muted)]">Get in touch for demos, partnerships, or support.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <Card className="p-6">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="mt-4" />
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="Your message"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
              />
            </div>
            <Button type="submit" loading={loading} size="lg" className="mt-6 w-full sm:w-auto">Send message</Button>
          </Card>
        </motion.form>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <Card className="p-6">
            <h3 className="text-h3 text-[var(--text-primary)] mb-2">Business</h3>
            <p className="text-body text-[var(--text-muted)] mb-4">contact@devbrain.ai</p>
            <p className="text-small text-[var(--text-muted)]">We typically respond within 24 hours.</p>
          </Card>
          <div className="rounded-2xl border border-[var(--border)] overflow-hidden aspect-video">
            <img
              src={IMAGES.contactMap}
              alt="Office location"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
