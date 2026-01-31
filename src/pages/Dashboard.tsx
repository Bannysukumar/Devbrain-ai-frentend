import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from 'react-query'
import { healthcheck, createSource } from '@/api/client'
import { DEMO_SOURCES } from '@/api/sourceForm'
import toast from 'react-hot-toast'
import { useAppMode } from '@/context/AppModeContext'
import { useDataAdapter } from '@/adapters/useDataAdapter'
import { Card, CardHeader, Button, Breadcrumb, SkeletonCard } from '@/components/ui'

const DEMO_GUIDE_DISMISSED_KEY = 'devbrain_demo_guide_dismissed'
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

export function Dashboard() {
  const queryClient = useQueryClient()
  const { mode, isDemo, isProduction } = useAppMode()
  const { adapter, backendOk, isDemoOffline } = useDataAdapter()
  const [demoLoading, setDemoLoading] = useState(false)
  const [guideDismissed, setGuideDismissed] = useState(() => {
    try {
      return localStorage.getItem(DEMO_GUIDE_DISMISSED_KEY) === '1'
    } catch {
      return false
    }
  })

  const { data: health, isLoading: healthLoading, isError: healthError } = useQuery('health', healthcheck, {
    refetchInterval: 30_000,
    retry: 1,
  })
  const { data: sources = [], isLoading: sourcesLoading, isError: sourcesError } = useQuery(
    ['sources', mode, backendOk],
    () => adapter.listSources(),
    { retry: 1 }
  )
  const { data: tasksRaw, isLoading: tasksLoading, isError: tasksError } = useQuery(
    ['tasks', mode, backendOk],
    () => adapter.listTasks(),
    { retry: 1 }
  )
  const tasks = Array.isArray(tasksRaw) ? tasksRaw : []

  useEffect(() => {
    try {
      if (guideDismissed) localStorage.setItem(DEMO_GUIDE_DISMISSED_KEY, '1')
      else localStorage.removeItem(DEMO_GUIDE_DISMISSED_KEY)
    } catch {}
  }, [guideDismissed])

  const runLoadDemoData = async () => {
    setDemoLoading(true)
    let created = 0
    let skipped = 0
    try {
      for (const payload of DEMO_SOURCES) {
        try {
          await createSource(payload)
          created++
          toast.success(`Created: ${payload.name}`)
        } catch (e: unknown) {
          const status = axios.isAxiosError(e) ? e.response?.status : undefined
          if (status === 409) skipped++
          else toast.error(`Failed: ${payload.name}`)
        }
      }
      queryClient.invalidateQueries(['sources', mode, backendOk])
      queryClient.invalidateQueries(['tasks', mode, backendOk])
      if (skipped > 0 && created === 0) {
        toast.success('Demo sources already exist. Open Tasks, wait for sync, then try Chat.')
      } else if (created > 0) {
        toast.success('Demo data created. Check Tasks for sync status, then try Chat.')
      } else {
        toast.success('Using local demo data. Try Search and Chat.')
      }
    } finally {
      setDemoLoading(false)
    }
  }

  const runDemoModeCurrent = async () => {
    setDemoLoading(true)
    let created = 0
    let skipped = 0
    for (const payload of DEMO_SOURCES) {
      try {
        await createSource(payload)
        created++
        toast.success(`Created: ${payload.name}`)
      } catch (e: unknown) {
        const status = axios.isAxiosError(e) ? e.response?.status : undefined
        if (status === 409) skipped++
        else toast.error(`Failed: ${payload.name}`)
      }
    }
    queryClient.invalidateQueries(['sources', mode, backendOk])
    queryClient.invalidateQueries(['tasks', mode, backendOk])
    setDemoLoading(false)
    if (skipped > 0 && created === 0) {
      toast.success('Demo sources already exist. Open Tasks, wait for sync, then try Chat.')
    } else {
      toast.success('Demo mode done. Check Tasks for sync status, then try Chat.')
    }
  }

  const isHealthy =
    !healthError &&
    health?.api?.status === 'ok' &&
    health?.redis?.status === 'ok' &&
    health?.postgres?.status === 'ok' &&
    (health?.workers?.status === 'ok' || health?.workers?.status === 'skipped')

  const runningCount = tasks.filter((t) => t.status === 'PENDING' || t.status === 'STARTED').length
  const showDemoGuide = isDemo && !guideDismissed
  const showLoadDemoData = isDemo
  const showCurrentDemoButton = mode === 'CURRENT'

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Dashboard' }]} />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[var(--accent-gradient)] opacity-[0.06]" aria-hidden />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--accent-primary)]/10 blur-3xl" aria-hidden />
        <div className="relative">
          <h1 className="text-display text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-body text-[var(--text-muted)] mt-2 max-w-xl">Unified technical knowledge for your tools — one place for docs, code, issues, and chat.</p>
        </div>
      </div>

      {showDemoGuide && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-h3 text-[var(--text-primary)] mb-2">Demo Guide</h2>
              <ol className="list-decimal list-inside space-y-1.5 text-small text-[var(--text-secondary)]">
                <li><strong className="text-[var(--text-primary)]">Open Sources</strong> — Pre-created demo sources are listed (or load demo data below).</li>
                <li><strong className="text-[var(--text-primary)]">Try Unified Search</strong> — Use suggested queries: &quot;How do we deploy?&quot;, &quot;Where is auth documented?&quot;</li>
                <li><strong className="text-[var(--text-primary)]">Open Chat</strong> — Ask sample questions; answers use demo citations when offline.</li>
                <li><strong className="text-[var(--text-primary)]">View Tasks + Health</strong> — See sync status or demo tasks when backend is offline.</li>
              </ol>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setGuideDismissed(true)} aria-label="Dismiss">✕</Button>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader title="How DevBrain AI solves S4" description="Fragmentation of technical knowledge across development tools." />
        <ul className="space-y-3 text-body text-[var(--text-secondary)]">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-xs font-bold text-[var(--accent-primary)] shrink-0 mt-0.5">1</span>
            <span><strong className="text-[var(--text-primary)]">Unified access</strong> – One place for docs, code repos, issue trackers, and chat logs.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-xs font-bold text-[var(--accent-primary)] shrink-0 mt-0.5">2</span>
            <span><strong className="text-[var(--text-primary)]">Semantic search</strong> – Search across all sources at once, grouped by tool or combined.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-xs font-bold text-[var(--accent-primary)] shrink-0 mt-0.5">3</span>
            <span><strong className="text-[var(--text-primary)]">RAG-powered chat</strong> – Answers grounded in your knowledge base with traceability.</span>
          </li>
        </ul>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {healthLoading ? (
          <SkeletonCard />
        ) : isDemoOffline ? (
          <Link to="/app/health">
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card hover className="p-6 border-amber-500/40">
                <span className="inline-flex w-10 h-10 rounded-xl bg-amber-500/20 items-center justify-center text-lg mb-3">📴</span>
                <p className="text-small text-[var(--text-muted)] font-medium">Backend status</p>
                <p className="text-h2 mt-2 text-amber-600 dark:text-amber-400">Demo Offline</p>
              </Card>
            </motion.div>
          </Link>
        ) : healthError ? (
          <Link to="/app/health">
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card hover className="p-6 border-[var(--error)]/30">
                <span className="inline-flex w-10 h-10 rounded-xl bg-[var(--error)]/10 items-center justify-center text-lg mb-3">⚠️</span>
                <p className="text-small text-[var(--text-muted)] font-medium">Backend status</p>
                <p className="text-h2 mt-2 text-[var(--error)]">Error</p>
              </Card>
            </motion.div>
          </Link>
        ) : (
          <Link to="/app/health">
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card hover className="p-6">
                <span className="inline-flex w-10 h-10 rounded-xl bg-[var(--success)]/10 items-center justify-center text-lg mb-3">✓</span>
                <p className="text-small text-[var(--text-muted)] font-medium">Backend status</p>
                <p className={`text-h2 mt-2 ${isHealthy ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                  {isHealthy ? 'Healthy' : 'Degraded'}
                </p>
              </Card>
            </motion.div>
          </Link>
        )}
        {sourcesLoading ? (
          <SkeletonCard />
        ) : sourcesError ? (
          <Link to="/app/sources">
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card hover className="p-6 border-[var(--error)]/30">
                <span className="inline-flex w-10 h-10 rounded-xl bg-[var(--error)]/10 items-center justify-center text-lg mb-3">⚠️</span>
                <p className="text-small text-[var(--text-muted)] font-medium">Total sources</p>
                <p className="text-h2 mt-2 text-[var(--error)]">Error</p>
              </Card>
            </motion.div>
          </Link>
        ) : (
          <Link to="/app/sources">
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card hover className="p-6">
                <span className="inline-flex w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 items-center justify-center text-lg mb-3">📚</span>
                <p className="text-small text-[var(--text-muted)] font-medium">Total sources</p>
                <p className="text-h2 mt-2 text-[var(--text-primary)]">{sources.length}</p>
              </Card>
            </motion.div>
          </Link>
        )}
        {tasksLoading ? (
          <SkeletonCard />
        ) : tasksError ? (
          <Link to="/app/tasks">
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card hover className="p-6 border-[var(--error)]/30">
                <span className="inline-flex w-10 h-10 rounded-xl bg-[var(--error)]/10 items-center justify-center text-lg mb-3">⚠️</span>
                <p className="text-small text-[var(--text-muted)] font-medium">Tasks running</p>
                <p className="text-h2 mt-2 text-[var(--error)]">Error</p>
              </Card>
            </motion.div>
          </Link>
        ) : (
          <Link to="/app/tasks">
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card hover className="p-6">
                <span className="inline-flex w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 items-center justify-center text-lg mb-3">⚙️</span>
                <p className="text-small text-[var(--text-muted)] font-medium">Tasks running</p>
                <p className="text-h2 mt-2 text-[var(--text-primary)]">{runningCount}</p>
              </Card>
            </motion.div>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader title="Quick actions" description="Jump to key features." />
        <div className="flex flex-wrap gap-3">
          <Link to="/app/sources">
            <Button size="md" leftIcon={<span>📚</span>}>Create Source</Button>
          </Link>
          {showLoadDemoData && (
            <Button size="md" variant="secondary" onClick={runLoadDemoData} disabled={demoLoading} leftIcon={demoLoading ? <span className="animate-spin">⏳</span> : <span>🎬</span>}>
              {demoLoading ? 'Loading…' : 'Load Demo Data'}
            </Button>
          )}
          {showCurrentDemoButton && (
            <Button size="md" variant="secondary" onClick={runDemoModeCurrent} disabled={demoLoading} leftIcon={demoLoading ? <span className="animate-spin">⏳</span> : <span>🎬</span>}>
              {demoLoading ? 'Creating…' : 'Demo Mode'}
            </Button>
          )}
          <Link to="/app/search">
            <Button size="md" variant="secondary" leftIcon={<span>🔍</span>}>Unified Search</Button>
          </Link>
          <Link to="/app/chat">
            <Button size="md" variant="secondary" leftIcon={<span>💬</span>}>Chat</Button>
          </Link>
        </div>
        {!isProduction && (showLoadDemoData || showCurrentDemoButton) && (
          <p className="text-small text-[var(--text-muted)] mt-4">
            {showLoadDemoData ? 'Load Demo Data creates sample sources via API or uses local demo data when offline.' : 'Demo Mode creates sample sources: docs, code, issues, chats.'}
          </p>
        )}
      </Card>
    </motion.div>
  )
}
