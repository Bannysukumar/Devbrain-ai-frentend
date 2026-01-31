import { useState } from 'react'
import { Card, CardHeader, Badge, Breadcrumb, Button, Input, EmptyState } from '@/components/ui'

const mockUsers = [
  { id: '1', name: 'Alex Kim', email: 'alex@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jordan Lee', email: 'jordan@example.com', role: 'User', status: 'Active' },
  { id: '3', name: 'Sam Taylor', email: 'sam@example.com', role: 'User', status: 'Pending' },
]

export function AdminUsers() {
  const [search, setSearch] = useState('')
  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Users' }]} />
      <Card>
        <CardHeader
          title="Users"
          description="Manage users (mock data)."
          action={<Button size="sm">Add user</Button>}
        />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 max-w-xs" />
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left text-small">
            <thead className="bg-[var(--bg-tertiary)]">
              <tr>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Name</th>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Email</th>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Role</th>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 text-[var(--text-primary)]">{u.name}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{u.email}</td>
                  <td className="px-4 py-3"><Badge>{u.role}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={u.status === 'Active' ? 'success' : 'warning'}>{u.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState title="No users match your search." />}
      </Card>
    </div>
  )
}
