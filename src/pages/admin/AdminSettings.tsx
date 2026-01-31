import { Card, CardHeader, Breadcrumb, Button } from '@/components/ui'
import toast from 'react-hot-toast'

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Settings' }]} />
      <Card>
        <CardHeader title="Admin configuration" description="Demo toggles (no backend)." />
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded border-[var(--border)]" />
            <span className="text-[var(--text-primary)]">Require email verification</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-[var(--border)]" />
            <span className="text-[var(--text-primary)]">Maintenance mode</span>
          </label>
          <Button size="sm" onClick={() => toast.success('Settings saved (demo).')}>Save</Button>
        </div>
      </Card>
    </div>
  )
}
