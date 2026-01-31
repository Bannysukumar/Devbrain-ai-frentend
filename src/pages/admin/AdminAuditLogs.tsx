import { Card, CardHeader, Badge, Breadcrumb } from '@/components/ui'

const mockLogs = [
  { id: 1, action: 'create_source', resource: 'demo-docs', user: 'alex@example.com', time: '2024-01-15T10:00:00Z' },
  { id: 2, action: 'update_source', resource: 'demo-code', user: 'jordan@example.com', time: '2024-01-15T09:30:00Z' },
  { id: 3, action: 'delete_source', resource: 'old-source', user: 'alex@example.com', time: '2024-01-14T16:00:00Z' },
]

export function AdminAuditLogs() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Audit Logs' }]} />
      <Card>
        <CardHeader title="Audit logs" description="Recent actions (mock data)." />
        <div className="space-y-2">
          {mockLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-4 py-3 border-b border-[var(--border)] last:border-0 text-small">
              <Badge variant="default">{log.action}</Badge>
              <span className="text-[var(--text-muted)]">{log.resource}</span>
              <span className="text-[var(--text-muted)]">{log.user}</span>
              <span className="text-[var(--text-muted)] ml-auto">{new Date(log.time).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
