import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { useAppMode } from '@/context/AppModeContext'
import { useDataAdapter } from '@/adapters/useDataAdapter'
import { getToolTypeFromConnector, type SourceMetadata, type SourceWithToolType } from '@/api/types'
import { CreateSourceModal } from '@/components/CreateSourceModal'
import { ToolTypeBadge } from '@/components/ToolTypeBadge'
import { DEMO_SOURCES, type CreateSourcePayload } from '@/api/sourceForm'
import { Card, Button, Breadcrumb, EmptyState, SkeletonTable, Modal } from '@/components/ui'

function withToolType(s: SourceMetadata): SourceWithToolType {
  return { ...s, toolType: getToolTypeFromConnector(s.connector) }
}

export function Sources() {
  const queryClient = useQueryClient()
  const { mode, isDemo } = useAppMode()
  const { adapter, backendOk } = useDataAdapter()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ name: string } | null>(null)
  const { data: sources = [], isLoading, isError, refetch } = useQuery(
    ['sources', mode, backendOk],
    () => adapter.listSources(),
    { retry: 1 }
  )
  const createMutation = useMutation(
    (payload: CreateSourcePayload) => adapter.createSource(payload),
    {
    onSuccess: () => {
      queryClient.invalidateQueries(['sources', mode, backendOk])
      queryClient.invalidateQueries(['tasks', mode, backendOk])
      setModalOpen(false)
      toast.success('Source created. Sync started.')
    },
    onError: (err: unknown) => {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      const msg = status === 409 ? 'Source with this name already exists.' : (axios.isAxiosError(err) && err.response?.data?.detail) ? (typeof err.response.data.detail === 'string' ? err.response.data.detail : 'Create failed.') : 'Create failed.'
      toast.error(msg)
    },
  })
  const deleteMutation = useMutation(
    (sourceName: string) => adapter.deleteSource(sourceName),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sources', mode, backendOk])
        setDeleteConfirm(null)
        toast.success('Source deleted.')
      },
    }
  )

  const handleCreate = (payload: CreateSourcePayload) => {
    createMutation.mutate(payload)
  }

  const handleDemoMode = async () => {
    let created = 0
    let skipped = 0
    for (const payload of DEMO_SOURCES) {
      try {
        await adapter.createSource(payload)
        created++
        toast.success(`Created: ${payload.name}`)
      } catch (e: unknown) {
        const status = axios.isAxiosError(e) ? e.response?.status : undefined
        if (status === 409) skipped++
        else toast.error(`Failed: ${payload.name}. Try again.`)
      }
    }
    queryClient.invalidateQueries(['sources', mode, backendOk])
    queryClient.invalidateQueries(['tasks', mode, backendOk])
    if (skipped > 0 && created === 0) {
      toast.success('Demo sources already exist. Open Tasks and wait for sync, then try Chat.')
    } else {
      toast.success('Demo sources created or already exist. Check Tasks for sync status.')
    }
  }

  const sourcesWithType = sources.map(withToolType)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Sources' }]} />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[var(--accent-gradient)] opacity-[0.05]" aria-hidden />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-display text-[var(--text-primary)]">Sources</h1>
            <p className="text-body text-[var(--text-muted)] mt-2">Connect docs, code repos, issues, and chats in one place.</p>
          </div>
          <div className="flex gap-2">
            {isDemo && (
              <Button variant="secondary" size="md" onClick={handleDemoMode} leftIcon={<span>🎬</span>}>
                Load Demo Data
              </Button>
            )}
            {mode === 'CURRENT' && (
              <Button variant="secondary" size="md" onClick={handleDemoMode} leftIcon={<span>🎬</span>}>
                Demo Mode
              </Button>
            )}
            <Button size="md" onClick={() => setModalOpen(true)} leftIcon={<span>➕</span>}>
              Create Source
            </Button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <CreateSourceModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
          isSubmitting={createMutation.isLoading}
        />
      )}

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete source" size="sm">
        {deleteConfirm && (
          <div className="space-y-4">
            <p className="text-body text-[var(--text-secondary)]">
              Delete source &quot;{deleteConfirm.name}&quot;? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => deleteMutation.mutate(deleteConfirm.name)} loading={deleteMutation.isLoading}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : isError ? (
        <Card>
          <EmptyState
            icon="⚠️"
            title="Failed to load sources"
            description="Check your connection and API configuration."
            action={<Button variant="secondary" size="sm" onClick={() => refetch()}>Retry</Button>}
          />
        </Card>
      ) : sourcesWithType.length === 0 ? (
        <Card>
          <EmptyState
            icon="📚"
            title="No sources yet"
            description="Create a source or use Demo Mode to add sample sources (docs, code, issues, chats)."
            action={
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setModalOpen(true)}>Create Source</Button>
                {(isDemo || mode === 'CURRENT') && (
                  <Button variant="secondary" size="sm" onClick={handleDemoMode}>
                    {isDemo ? 'Load Demo Data' : 'Demo Mode'}
                  </Button>
                )}
              </div>
            }
          />
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
                  <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">Name</th>
                  <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">Type</th>
                  <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">Description</th>
                  <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">Updated</th>
                  <th className="px-6 py-4 text-right font-semibold text-[var(--text-primary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sourcesWithType.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/app/sources/${encodeURIComponent(s.name)}`} className="font-medium text-[var(--accent-primary)] hover:underline">
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <ToolTypeBadge toolType={s.toolType} />
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)] max-w-xs truncate">{s.description}</td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">
                      {s.updated_at ? new Date(s.updated_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/app/sources/${encodeURIComponent(s.name)}`}>
                        <Button variant="ghost" size="sm" className="mr-2">View</Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-[var(--error)] hover:bg-red-500/10" onClick={() => setDeleteConfirm({ name: s.name })}>
                        Delete
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  )
}
