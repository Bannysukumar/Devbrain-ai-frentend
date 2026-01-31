import { Card, CardHeader, Breadcrumb } from '@/components/ui'
import { blogPosts } from '@/data/mock'

export function AdminSiteContent() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Site Content' }]} />
      <Card>
        <CardHeader title="Blog posts" description="Manage blog content (mock)." />
        <ul className="space-y-2">
          {blogPosts.map((p) => (
            <li key={p.slug} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <span className="text-[var(--text-primary)]">{p.title}</span>
              <span className="text-small text-[var(--text-muted)]">{p.date}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
