export interface LinkedSourceRef {
  sourceName: string
  documentId?: string
  url?: string
  label?: string
}

export interface KnowledgeCard {
  id: string
  title: string
  summary: string
  tags: string[]
  linkedRefs: LinkedSourceRef[]
  pinned: boolean
  createdAt: string
  updatedAt: string
}

const KEY = 'devbrain_knowledge_cards'

function loadRaw(): KnowledgeCard[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function loadCards(): KnowledgeCard[] {
  return loadRaw().sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

export function getCard(id: string): KnowledgeCard | undefined {
  return loadRaw().find((c) => c.id === id)
}

export function saveCard(card: Omit<KnowledgeCard, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): KnowledgeCard {
  const raw = loadRaw()
  const now = new Date().toISOString()
  if (card.id && raw.some((c) => c.id === card.id)) {
    const next = raw.map((c) =>
      c.id === card.id
        ? {
            ...c,
            title: card.title,
            summary: card.summary,
            tags: Array.isArray(card.tags) ? card.tags : [],
            linkedRefs: Array.isArray(card.linkedRefs) ? card.linkedRefs : [],
            pinned: !!card.pinned,
            updatedAt: now,
          }
        : c
    )
    localStorage.setItem(KEY, JSON.stringify(next))
    return next.find((c) => c.id === card.id)!
  }
  const newCard: KnowledgeCard = {
    id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    title: card.title,
    summary: card.summary,
    tags: Array.isArray(card.tags) ? card.tags : [],
    linkedRefs: Array.isArray(card.linkedRefs) ? card.linkedRefs : [],
    pinned: !!card.pinned,
    createdAt: now,
    updatedAt: now,
  }
  raw.unshift(newCard)
  localStorage.setItem(KEY, JSON.stringify(raw))
  return newCard
}

export function deleteCard(id: string): void {
  const next = loadRaw().filter((c) => c.id !== id)
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function togglePin(id: string): void {
  const raw = loadRaw()
  const next = raw.map((c) => (c.id === id ? { ...c, pinned: !c.pinned, updatedAt: new Date().toISOString() } : c))
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function exportCardAsMarkdown(card: KnowledgeCard): string {
  const lines: string[] = [
    `# ${card.title}`,
    '',
    card.summary,
    '',
    `**Tags:** ${card.tags.join(', ') || '—'}`,
    '',
    '## Linked references',
  ]
  card.linkedRefs.forEach((r) => {
    const label = r.label || r.documentId || r.sourceName
    const url = r.url || '#'
    lines.push(`- [${label}](${url}) (${r.sourceName})`)
  })
  lines.push('')
  lines.push(`*Exported from DevBrain AI — ${card.updatedAt}*`)
  return lines.join('\n')
}
