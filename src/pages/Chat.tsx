import { useState, useRef, useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useAppMode } from '@/context/AppModeContext'
import { useDataAdapter } from '@/adapters/useDataAdapter'
import { getToolTypeFromConnector, type SourceWithToolType } from '@/api/types'
import { suggestedChatQuestions } from '@/data/demoDataset'
import { ToolTypeBadge } from '@/components/ToolTypeBadge'
import toast from 'react-hot-toast'
import { Button, Card, Modal } from '@/components/ui'
import type { ChatMessage, CreateChatPayload } from '@/api/types'

const CONVERSATIONS_KEY = 'devbrain_chat_conversations'
const CURRENT_CONV_KEY = 'devbrain_chat_current'


interface StoredConversation {
  id: string
  title: string
  createdAt: string
  messages: ChatMessage[]
  sourceNames: string[]
}

function computeConfidence(sourceCount: number, responseLength: number, lastContent: string): number {
  const lowInfoPhrases = /not enough|don't have|no information|i don't know|cannot find|no sources/i
  if (lowInfoPhrases.test(lastContent) || (sourceCount === 0 && lastContent.length < 50)) return Math.min(20, 10 + responseLength / 10)
  let score = 20
  if (sourceCount > 0) score += Math.min(40, sourceCount * 15)
  if (responseLength > 100) score += 20
  if (responseLength > 300) score += 20
  return Math.min(100, Math.round(score))
}

function isNotEnoughInfo(content: string, sourceCount: number): boolean {
  if (!content || content.trim().length < 10) return true
  if (sourceCount === 0 && content.length < 80) return true
  const lowPhrases = /not enough information|no information in knowledge|i don't have|cannot find any|couldn't find/i
  return lowPhrases.test(content)
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [selectedSourceNames, setSelectedSourceNames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [citationModal, setCitationModal] = useState<{ title: string; content: string; url?: string } | null>(null)
  const [conversations, setConversations] = useState<StoredConversation[]>(() => {
    try {
      const raw = localStorage.getItem(CONVERSATIONS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [activeId, setActiveId] = useState<string | null>(() => localStorage.getItem(CURRENT_CONV_KEY))
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { mode, isDemo } = useAppMode()
  const { adapter, backendOk } = useDataAdapter()
  const { data: sources = [], isError: sourcesError, refetch: refetchSources } = useQuery(
    ['sources', mode, backendOk],
    () => adapter.listSources(),
    { retry: 1 }
  )
  const sourcesWithType = sources.map((s) => ({ ...s, toolType: getToolTypeFromConnector(s.connector) })) as SourceWithToolType[]
  const suggestedQuestions = isDemo ? suggestedChatQuestions : [
    'What is the main purpose of this project?',
    'How do I get started?',
    'Where is the API documentation?',
    'What are the common troubleshooting steps?',
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const conv = conversations.find((c) => c.id === activeId)
    if (conv) {
      setMessages(conv.messages)
      setSelectedSourceNames(conv.sourceNames ?? [])
    } else {
      setMessages([])
      setSelectedSourceNames([])
    }
  }, [activeId, conversations])

  const saveConversations = (next: StoredConversation[]) => {
    setConversations(next)
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next))
    } catch {}
  }

  const startNew = () => {
    setActiveId(null)
    setMessages([])
    setSelectedSourceNames([])
    localStorage.removeItem(CURRENT_CONV_KEY)
  }

  const selectConversation = (id: string) => {
    setActiveId(id)
    localStorage.setItem(CURRENT_CONV_KEY, id)
  }

  const addOrUpdateConversation = (id: string, title: string, msgs: ChatMessage[], sourceNames: string[]) => {
    const next = conversations.filter((c) => c.id !== id)
    next.unshift({
      id,
      title,
      createdAt: new Date().toISOString(),
      messages: msgs,
      sourceNames,
    })
    saveConversations(next.slice(0, 50))
    setActiveId(id)
    localStorage.setItem(CURRENT_CONV_KEY, id)
  }

  const toggleSource = (name: string) => {
    setSelectedSourceNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const userMsg: ChatMessage = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setLoading(true)

    const payload: CreateChatPayload = {
      sources: selectedSourceNames.length > 0 ? selectedSourceNames : undefined,
      messages: nextMessages,
    }

    try {
      const res = await adapter.chat(payload)
      const assistantContent = res?.message ?? ''
      const noInfo = !assistantContent.trim() || assistantContent.length < 20
      const displayContent = noInfo
        ? 'Not enough information in knowledge base. Add more sources or rephrase your question.'
        : assistantContent
      const assistantMsg: ChatMessage = { role: 'assistant', content: displayContent }
      const finalMessages = [...nextMessages, assistantMsg]
      setMessages(finalMessages)

      const convId = activeId ?? `conv_${Date.now()}`
      const title = activeId ? (conversations.find((c) => c.id === activeId)?.title ?? text.slice(0, 40)) : text.slice(0, 40)
      addOrUpdateConversation(convId, title, finalMessages, selectedSourceNames)
    } catch (err) {
      setInput(text)
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      const detail = axios.isAxiosError(err) && err.response?.data?.detail
      const errMsg = typeof detail === 'string' ? detail : Array.isArray(detail) ? detail.map((e: { msg?: string }) => e?.msg).filter(Boolean).join(', ') : 'Request failed.'
      const hint = status === 400 ? ' Create at least one source in Sources, wait for sync to complete, then try again.' : ''
      const errorBubble: ChatMessage = { role: 'assistant', content: `Error: ${errMsg}${hint}` }
      setMessages([...nextMessages, errorBubble])
    } finally {
      setLoading(false)
    }
  }

  const copyAnswer = () => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant')
    if (lastAssistant?.content) {
      navigator.clipboard.writeText(lastAssistant.content)
      toast.success('Copied to clipboard.')
    } else {
      toast.error('No answer to copy.')
    }
  }

  const exportConversation = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      sourceNames: selectedSourceNames,
      messages,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `devbrain-chat-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported.')
  }

  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant')
  const sourcesUsed = selectedSourceNames.length > 0 ? selectedSourceNames : (sourcesWithType.map((s) => s.name).slice(0, 5))
  const confidence = lastAssistantMessage
    ? computeConfidence(sourcesUsed.length, lastAssistantMessage.content.length, lastAssistantMessage.content)
    : null
  const notEnoughInfo = lastAssistantMessage
    ? isNotEnoughInfo(lastAssistantMessage.content, sourcesUsed.length)
    : false

  const exportAnswerAudit = () => {
    const last = [...messages].reverse().find((m) => m.role === 'assistant')
    const report = [
      '# Answer Audit',
      '',
      `**Generated:** ${new Date().toISOString()}`,
      '',
      '## Question',
      (messages.filter((m) => m.role === 'user').pop()?.content ?? '—'),
      '',
      '## Answer',
      last?.content ?? '—',
      '',
      '## Sources used',
      sourcesUsed.length ? sourcesUsed.map((s) => `- ${s}`).join('\n') : 'All available sources',
      '',
      '## Metadata',
      `- Confidence (heuristic): ${confidence ?? '—'}%`,
      `- Not enough info flag: ${notEnoughInfo}`,
    ].join('\n')
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `devbrain-audit-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Audit report exported.')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 h-[calc(100vh-8rem)]">
      <Card className="w-56 shrink-0 p-0 overflow-hidden flex flex-col" padding="none">
        <div className="p-3 border-b border-[var(--border)]">
          <Button size="md" className="w-full" onClick={startNew}>New conversation</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 && (
            <p className="text-[var(--text-muted)] text-xs p-2">No conversations yet.</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => selectConversation(c.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm truncate mb-1 transition-colors ${
                activeId === c.id ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]/50'
              }`}
            >
              {c.title || 'Chat'}
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex-1 flex flex-col min-w-0 p-0 overflow-hidden" padding="none">
        <div className="p-3 border-b border-[var(--border)] flex flex-wrap items-center gap-2 bg-[var(--bg-tertiary)]/30">
          {sourcesError && (
            <>
              <span className="text-[var(--warning)] text-sm">Failed to load sources.</span>
              <Button size="sm" variant="secondary" onClick={() => refetchSources()}>Retry</Button>
            </>
          )}
          <span className="text-[var(--text-muted)] text-sm">Context (sources):</span>
          {sourcesWithType.map((s) => (
            <button
              key={s.name}
              onClick={() => toggleSource(s.name)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                selectedSourceNames.includes(s.name)
                  ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/40'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <ToolTypeBadge toolType={s.toolType} />
              {s.name}
            </button>
          ))}
          {sourcesWithType.length === 0 && (
            <span className="text-[var(--warning)] text-xs font-medium">
              No sources. Create at least one source (Sources or Dashboard → Demo Mode) and wait for sync.
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 px-4">
              <p className="text-[var(--text-muted)] text-sm mb-4">
                Send a message to chat with your knowledge base. Selected sources constrain context.
              </p>
              <p className="text-[var(--text-muted)] text-xs mb-3">Sample questions:</p>
              <ul className="space-y-2">
                {suggestedQuestions.map((q, i) => (
                  <motion.li key={q} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <button
                      type="button"
                      onClick={() => setInput(q)}
                      className="text-sm text-[var(--accent-primary)] hover:underline text-left max-w-md mx-auto block"
                    >
                      {q}
                    </button>
                  </motion.li>
                ))}
              </ul>
              {sourcesWithType.length === 0 && (
                <span className="block mt-4 text-[var(--warning)]/90 text-sm">
                  No sources yet. Create at least one source in Sources and wait for sync.
                </span>
              )}
            </div>
          )}
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  m.role === 'user'
                    ? 'bg-[var(--accent-primary)]/20 text-[var(--text-primary)]'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2.5 bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-sm">
                Thinking…
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {lastAssistantMessage && (
          <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-tertiary)]/30 space-y-2">
            <p className="text-[var(--text-muted)] text-xs font-medium">Sources used</p>
            <div className="flex flex-wrap gap-2">
              {sourcesUsed.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCitationModal({ title: name, content: `Source: ${name}. Per-message citations not returned by API yet.`, url: undefined })}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <ToolTypeBadge toolType={sourcesWithType.find((s) => s.name === name)?.toolType ?? 'docs'} />
                  {name}
                </button>
              ))}
              {sourcesUsed.length === 0 && (
                <span className="text-[var(--text-muted)] text-xs">All available sources (or none configured).</span>
              )}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] text-xs">Confidence:</span>
                <div className="w-24 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (confidence ?? 0) >= 60 ? 'bg-[var(--success)]' : (confidence ?? 0) >= 30 ? 'bg-[var(--warning)]' : 'bg-[var(--error)]/80'
                    }`}
                    style={{ width: `${confidence ?? 0}%` }}
                  />
                </div>
                <span className="text-[var(--text-muted)] text-xs">{confidence ?? 0}%</span>
              </div>
              {notEnoughInfo && (
                <span className="text-[var(--warning)] text-xs">Not enough information in knowledge base.</span>
              )}
            </div>
          </div>
        )}

        <div className="p-3 border-t border-[var(--border)] flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={copyAnswer}>Copy answer</Button>
          <Button variant="secondary" size="sm" onClick={exportConversation}>Export conversation</Button>
          {lastAssistantMessage && (
            <Button variant="secondary" size="sm" onClick={exportAnswerAudit}>Answer Audit</Button>
          )}
        </div>

        <div className="p-3 border-t border-[var(--border)] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask your knowledge base…"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()} size="md">Send</Button>
        </div>
      </Card>

      <Modal open={!!citationModal} onClose={() => setCitationModal(null)} title={citationModal?.title ?? 'Citation'} size="sm">
        {citationModal && (
          <div className="space-y-4">
            <p className="text-[var(--text-secondary)] text-small whitespace-pre-wrap">{citationModal.content}</p>
            {citationModal.url && (
              <a
                href={citationModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-primary)] text-sm hover:underline"
              >
                Open reference
              </a>
            )}
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setCitationModal(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
