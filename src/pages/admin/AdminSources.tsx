import { Breadcrumb } from '@/components/ui'
import { Sources } from '@/pages/Sources'

export function AdminSources() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Sources' }]} />
      <Sources />
    </div>
  )
}
