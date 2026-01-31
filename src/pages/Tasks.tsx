import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { useAppMode } from '@/context/AppModeContext'
import { useDataAdapter } from '@/adapters/useDataAdapter'
import { Breadcrumb, Card, Button, Badge, EmptyState, SkeletonTable } from '@/components/ui'

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  PENDING: 'default',
  STARTED: 'warning',
  SUCCESS: 'success',
  FAILURE: 'error',
  REVOKED: 'default',
}

export function Tasks() {
  const { mode } = useAppMode()
  const { adapter, backendOk } = useDataAdapter()
  const { data: tasks = [], isLoading, isError, refetch } = useQuery(
    ['tasks', mode, backendOk],
    () => adapter.listTasks(),
    { refetchInterval: 5000, retry: 1 }
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Tasks' }]} />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[var(--accent-gradient)] opacity-[0.05]" aria-hidden />
        <div className="relative">
          <h1 className="text-display text-[var(--text-primary)]">Tasks</h1>
          <p className="text-body text-[var(--text-muted)] mt-2">
            Background sync and ingestion jobs. Click a task for details or to terminate.
          </p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable rows={8} />
      ) : isError ? (
        <Card className="border-[var(--error)]/30 bg-[var(--error)]/5">
          <EmptyState
            icon="⚠️"
            title="Failed to load tasks"
            description="Check your connection and API configuration."
            action={<Button variant="secondary" size="sm" onClick={() => refetch()}>Retry</Button>}
          />
        </Card>
      ) : tasks.length === 0 ? (
        <Card>
          <EmptyState
            icon="⚙️"
            title="No tasks yet"
            description="Create a source to trigger a sync task."
          />
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
                  <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">ID</th>
                  <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">Type / Progress</th>
                  <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">Completed</th>
                  <th className="px-6 py-4 text-right font-semibold text-[var(--text-primary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t, i) => (
                  <motion.tr
                    key={t.id ?? ''}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-[var(--text-secondary)] truncate max-w-[180px]">
                      <Link to={`/app/tasks/${encodeURIComponent(t.id ?? '')}`} className="font-medium text-[var(--accent-primary)] hover:underline">
                        {t.id ?? '—'}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[t.status ?? ''] ?? 'default'}>{t.status ?? '—'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">
                      {typeof t.metadata === 'object' && t.metadata !== null
                        ? JSON.stringify(t.metadata).slice(0, 60) + (Object.keys(t.metadata).length > 0 ? '…' : '')
                        : String(t.metadata ?? '—')}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">
                      {t.completed_at ? new Date(t.completed_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/app/tasks/${encodeURIComponent(t.id ?? '')}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
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
