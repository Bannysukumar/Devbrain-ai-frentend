import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { useDataAdapter } from '@/adapters/useDataAdapter'
import { getToolTypeFromConnector, type SourceWithToolType } from '@/api/types'
import type { UpdateSourcePayload } from '@/api/types'
import { ToolTypeBadge } from '@/components/ToolTypeBadge'
import { Breadcrumb, Card, Button, Tabs, TabsList, TabsTrigger, TabsContent, Skeleton } from '@/components/ui'

type Tab = 'documents' | 'search' | 'settings'

export function SourceDetail() {
  const { sourceName } = useParams<{ sourceName: string }>()
  const [tab, setTab] = useState<Tab>('documents')
  const [searchQuery, setSearchQuery] = useState('')
  const [topK, setTopK] = useState(10)
  const [editDescription, setEditDescription] = useState('')
  const [editSync, setEditSync] = useState(true)
  const queryClient = useQueryClient()
  const { adapter, mode, backendOk } = useDataAdapter()

  const { data: source, isLoading: sourceLoading, isError: sourceError } = useQuery(
    ['source', sourceName, mode, backendOk],
    () => adapter.getSource(sourceName!),
    { enabled: !!sourceName, retry: 1 }
  )

  const { data: documents = [], isLoading: docsLoading } = useQuery(
    ['documents', sourceName, mode, backendOk],
    () => adapter.listDocuments(sourceName!, 100, 0),
    { enabled: !!sourceName && tab === 'documents' }
  )

  const [searchResults, setSearchResults] = useState<import('@/api/types').Document[]>([])
  const [searching, setSearching] = useState(false)
  const runSearch = async () => {
    if (!sourceName || !searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await adapter.searchSource(sourceName, searchQuery.trim(), topK)
      setSearchResults(res)
    } finally {
      setSearching(false)
    }
  }

  const updateMutation = useMutation(
    (payload: UpdateSourcePayload) => adapter.updateSource(sourceName!, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['source', sourceName, mode, backendOk])
        queryClient.invalidateQueries(['sources', mode, backendOk])
        queryClient.invalidateQueries(['tasks', mode, backendOk])
        toast.success('Source updated.')
      },
    }
  )

  const sourceWithType: SourceWithToolType | undefined = source
    ? { ...source, toolType: getToolTypeFromConnector(source.connector) }
    : undefined

  if (!sourceName) return <p className="text-[var(--text-muted)]">Missing source name.</p>
  if (sourceLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Sources', href: '/app/sources' }, { label: '…' }]} />
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </motion.div>
    )
  }
  if (sourceError || !source) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Sources', href: '/app/sources' }, { label: sourceName }]} />
        <Card className="border-[var(--error)]/30 bg-[var(--error)]/5">
          <p className="text-[var(--error)] font-medium">Source not found or failed to load.</p>
          <p className="text-small text-[var(--text-muted)] mt-1">Check the name or try again from Sources.</p>
          <Link to="/app/sources"><Button variant="secondary" size="sm" className="mt-3">← Back to Sources</Button></Link>
        </Card>
      </motion.div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'documents', label: 'Documents' },
    { id: 'search', label: 'Search' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Sources', href: '/app/sources' }, { label: source.name }]} />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="absolute inset-0 bg-[var(--accent-gradient)] opacity-[0.05]" aria-hidden />
        <div className="relative flex flex-wrap items-center gap-3">
          <Link to="/app/sources" className="text-small text-[var(--text-muted)] hover:text-[var(--text-primary)]">← Sources</Link>
          <h1 className="text-display text-[var(--text-primary)]">{source.name}</h1>
          {sourceWithType && <ToolTypeBadge toolType={sourceWithType.toolType} />}
        </div>
        <p className="text-body text-[var(--text-muted)] mt-2">{source.description}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {source.num_docs} docs · Last task: {source.last_task_id ?? '—'}
        </p>
      </div>

      <Tabs value={tab} onChange={(v) => setTab(v as Tab)}>
        <TabsList>
          {tabs.map(({ id, label }) => (
            <TabsTrigger key={id} value={id}>{label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="documents">
          <Card padding="none" className="overflow-hidden">
            {docsLoading ? (
              <div className="p-6">
                <Skeleton className="h-4 w-full mb-2 rounded-lg" />
                <Skeleton className="h-4 w-2/3 mb-2 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
            ) : documents.length === 0 ? (
              <div className="p-6 text-[var(--text-muted)] text-small">No documents yet. Sync may still be running.</div>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {documents.map((d, i) => (
                  <motion.li
                    key={d.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="p-4 hover:bg-[var(--bg-tertiary)]/30 transition-colors"
                  >
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--accent-primary)] hover:underline"
                    >
                      {d.title || d.id}
                    </a>
                    <p className="text-[var(--text-muted)] text-small mt-1 line-clamp-2">{d.content?.slice(0, 200)}…</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 opacity-80">{d.url}</p>
                  </motion.li>
                ))}
              </ul>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                placeholder="Search in this source…"
                className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
              <select
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>top {n}</option>
                ))}
              </select>
              <Button onClick={runSearch} disabled={searching || !searchQuery.trim()} size="md">
                {searching ? 'Searching…' : 'Search'}
              </Button>
            </div>
            <Card padding="none" className="overflow-hidden">
              {searchResults.length === 0 && !searching && (
                <div className="p-6 text-[var(--text-muted)] text-small">Enter a query and click Search.</div>
              )}
              {searchResults.length > 0 && (
                <ul className="divide-y divide-[var(--border)]">
                  {searchResults.map((d) => (
                    <li key={d.id} className="p-4 hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[var(--accent-primary)] hover:underline"
                      >
                        {d.title || d.id}
                      </a>
                      <p className="text-[var(--text-muted)] text-small mt-1 line-clamp-2">{d.content?.slice(0, 300)}…</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="max-w-md">
            <div className="space-y-4">
              <div>
                <label className="block text-small font-medium text-[var(--text-secondary)] mb-1">Description</label>
                <textarea
                  value={editDescription || source.description}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                />
              </div>
              <label className="flex items-center gap-2 text-[var(--text-secondary)] text-small cursor-pointer">
                <input
                  type="checkbox"
                  checked={editSync}
                  onChange={(e) => setEditSync(e.target.checked)}
                  className="rounded border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--accent-primary)]"
                />
                Trigger sync on update
              </label>
              <Button
                onClick={() =>
                  updateMutation.mutate({
                    description: editDescription || source.description,
                    sync: editSync,
                  })
                }
                disabled={updateMutation.isLoading}
                size="md"
              >
                {updateMutation.isLoading ? 'Updating…' : 'Update Source'}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
