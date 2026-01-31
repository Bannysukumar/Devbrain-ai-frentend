import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { healthcheck } from '@/api/client'
import { useDataAdapter } from '@/adapters/useDataAdapter'
import { Card, CardHeader, Badge, Breadcrumb } from '@/components/ui'
import { SkeletonCard } from '@/components/ui/Skeleton'

export function AdminDashboard() {
  const { adapter, backendOk, mode } = useDataAdapter()
  const { data: health, isLoading: healthLoading } = useQuery('health', healthcheck, { retry: 1 })
  const { data: sources = [] } = useQuery(['sources', mode, backendOk], () => adapter.listSources(), { retry: 1 })
  const { data: tasksRaw } = useQuery(['tasks', mode, backendOk], () => adapter.listTasks(), { retry: 1 })
  const tasks = Array.isArray(tasksRaw) ? tasksRaw : []

  const isHealthy = health?.api?.status === 'ok' && health?.redis?.status === 'ok'

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Dashboard' }]} />
      <h1 className="text-h1 text-[var(--text-primary)]">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthLoading ? (
          <SkeletonCard />
        ) : (
          <Card>
            <p className="text-small text-[var(--text-muted)]">System health</p>
            <p className={`text-h2 mt-1 ${isHealthy ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
              {isHealthy ? 'Healthy' : 'Degraded'}
            </p>
          </Card>
        )}
        <Card>
          <p className="text-small text-[var(--text-muted)]">Total sources</p>
          <p className="text-h2 mt-1 text-[var(--text-primary)]">{sources.length}</p>
        </Card>
        <Card>
          <p className="text-small text-[var(--text-muted)]">Tasks</p>
          <p className="text-h2 mt-1 text-[var(--text-primary)]">{tasks.length}</p>
        </Card>
        <Card>
          <p className="text-small text-[var(--text-muted)]">Admin</p>
          <Badge variant="success" className="mt-1">Active</Badge>
        </Card>
      </div>

      <Card>
        <CardHeader title="Latest tasks" description="Recent sync and API tasks." />
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {tasks.slice(0, 10).map((t) => (
            <div key={t.id ?? ''} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <span className="text-small text-[var(--text-primary)] font-mono truncate">{t.id}</span>
              <Badge variant={t.status === 'COMPLETED' ? 'success' : t.status === 'FAILED' ? 'error' : 'default'}>{t.status ?? '—'}</Badge>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-small text-[var(--text-muted)]">No tasks yet.</p>}
        </div>
        <Link to="/admin/sources" className="inline-block mt-4 text-small text-[var(--accent-primary)] hover:underline">Manage sources →</Link>
      </Card>
    </div>
  )
}
