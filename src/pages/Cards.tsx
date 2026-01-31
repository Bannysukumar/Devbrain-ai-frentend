import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { loadCards, saveCard, deleteCard, togglePin, getCard, exportCardAsMarkdown, type KnowledgeCard, type LinkedSourceRef } from '@/store/cards'
import toast from 'react-hot-toast'
import { Breadcrumb, Card, Button, Badge, EmptyState, Modal, Input } from '@/components/ui'

export function Cards() {
  const [cards, setCards] = useState<KnowledgeCard[]>([])
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [modal, setModal] = useState<'closed' | 'create' | 'edit'>('closed')
  const [editing, setEditing] = useState<KnowledgeCard | null>(null)
  const [form, setForm] = useState({ title: '', summary: '', tagsStr: '', linkedRefs: [] as LinkedSourceRef[] })

  const refresh = () => setCards(loadCards())

  useEffect(() => {
    refresh()
  }, [])

  const filtered = useMemo(() => {
    let list = cards
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (tagFilter.trim()) {
      const t = tagFilter.trim().toLowerCase()
      list = list.filter((c) => c.tags.some((tag) => tag.toLowerCase() === t))
    }
    return list
  }, [cards, search, tagFilter])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    cards.forEach((c) => c.tags.forEach((t) => t && set.add(t)))
    return Array.from(set).sort()
  }, [cards])

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', summary: '', tagsStr: '', linkedRefs: [] })
    setModal('create')
  }

  const openEdit = (card: KnowledgeCard) => {
    setEditing(card)
    setForm({
      title: card.title,
      summary: card.summary,
      tagsStr: card.tags.join(', '),
      linkedRefs: [...card.linkedRefs],
    })
    setModal('edit')
  }

  const closeModal = () => {
    setModal('closed')
    setEditing(null)
  }

  const handleSave = () => {
    const title = form.title.trim()
    if (!title) {
      toast.error('Title is required.')
      return
    }
    const tags = form.tagsStr
      .split(/[,;]/)
      .map((t) => t.trim())
      .filter(Boolean)
    if (editing) {
      saveCard({
        id: editing.id,
        title,
        summary: form.summary.trim(),
        tags,
        linkedRefs: form.linkedRefs,
        pinned: editing.pinned,
      })
      toast.success('Card updated.')
    } else {
      saveCard({ title, summary: form.summary.trim(), tags, linkedRefs: form.linkedRefs, pinned: false })
      toast.success('Card created.')
    }
    refresh()
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this knowledge card?')) {
      deleteCard(id)
      refresh()
      if (editing?.id === id) closeModal()
      toast.success('Card deleted.')
    }
  }

  const handlePin = (id: string) => {
    togglePin(id)
    refresh()
    if (editing?.id === id) setEditing(getCard(id) ?? null)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Knowledge Cards' }]} />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[var(--accent-gradient)] opacity-[0.05]" aria-hidden />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-display text-[var(--text-primary)]">Knowledge Cards</h1>
            <p className="text-body text-[var(--text-muted)] mt-2">Tribal knowledge snippets for onboarding. Create, pin, export.</p>
          </div>
          <Button size="md" onClick={openCreate} leftIcon={<span>➕</span>}>New card</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards…"
            className="flex-1 min-w-[200px]"
          />
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]"
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </Card>

      {filtered.length === 0 && (
        <Card>
          <EmptyState
            icon="📌"
            title={cards.length === 0 ? 'No knowledge cards yet' : 'No cards match'}
            description={cards.length === 0 ? 'Create one to capture tribal knowledge.' : 'Try a different search or tag filter.'}
            action={cards.length === 0 ? <Button size="sm" onClick={openCreate}>New card</Button> : undefined}
          />
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card hover className="p-4 flex flex-col h-full">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-h3 text-[var(--text-primary)] truncate flex-1">{card.title}</h2>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handlePin(card.id)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--warning)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    title={card.pinned ? 'Unpin' : 'Pin'}
                  >
                    {card.pinned ? '📌' : '📍'}
                  </button>
                  <button
                    onClick={() => openEdit(card)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
              <p className="text-small text-[var(--text-muted)] line-clamp-3 flex-1 mb-2">{card.summary || '—'}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {card.tags.map((t) => (
                  <Badge key={t} variant="default">{t}</Badge>
                ))}
              </div>
              {card.linkedRefs.length > 0 && (
                <p className="text-xs text-[var(--text-muted)] mb-2">{card.linkedRefs.length} linked source(s)</p>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--accent-primary)] w-fit"
                onClick={() => {
                  const md = exportCardAsMarkdown(card)
                  const blob = new Blob([md], { type: 'text/markdown' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `devbrain-card-${card.id}.md`
                  a.click()
                  URL.revokeObjectURL(url)
                  toast.success('Exported as markdown.')
                }}
              >
                Export as Markdown
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={modal !== 'closed'} onClose={closeModal} title={modal === 'create' ? 'New knowledge card' : 'Edit card'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-small text-[var(--text-muted)] mb-1">Title</label>
            <Input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. How we deploy"
            />
          </div>
          <div>
            <label className="block text-small text-[var(--text-muted)] mb-1">Summary</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              placeholder="Short description for onboarding"
            />
          </div>
          <div>
            <label className="block text-small text-[var(--text-muted)] mb-1">Tags (comma-separated)</label>
            <Input
              type="text"
              value={form.tagsStr}
              onChange={(e) => setForm((f) => ({ ...f, tagsStr: e.target.value }))}
              placeholder="onboarding, deploy, docs"
            />
          </div>
          <div>
            <label className="block text-small text-[var(--text-muted)] mb-1">Linked source references</label>
            <p className="text-xs text-[var(--text-muted)] mb-2">Add source name and optional URL/label.</p>
            {form.linkedRefs.map((r, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={r.sourceName}
                  onChange={(e) => {
                    const next = [...form.linkedRefs]
                    next[i] = { ...next[i], sourceName: e.target.value }
                    setForm((f) => ({ ...f, linkedRefs: next }))
                  }}
                  placeholder="Source name"
                  className="flex-1"
                />
                <Input
                  type="text"
                  value={r.url ?? ''}
                  onChange={(e) => {
                    const next = [...form.linkedRefs]
                    next[i] = { ...next[i], url: e.target.value || undefined }
                    setForm((f) => ({ ...f, linkedRefs: next }))
                  }}
                  placeholder="URL"
                  className="flex-1"
                />
                <Button variant="ghost" size="sm" className="text-[var(--error)]" onClick={() => setForm((f) => ({ ...f, linkedRefs: f.linkedRefs.filter((_, j) => j !== i) }))}>×</Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="text-[var(--accent-primary)]" onClick={() => setForm((f) => ({ ...f, linkedRefs: [...f.linkedRefs, { sourceName: '' }] }))}>+ Add reference</Button>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </Modal>
    </motion.div>
  )
}
