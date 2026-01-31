import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { useDataAdapter } from '@/adapters/useDataAdapter'
import { Breadcrumb, Card, Button, Badge, Modal, Skeleton } from '@/components/ui'

export function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>()
  const [confirmTerminate, setConfirmTerminate] = useState(false)
  const queryClient = useQueryClient()
  const { adapter, mode, backendOk } = useDataAdapter()

  const { data: task, isLoading, isError, refetch } = useQuery(
    ['task', taskId, mode, backendOk],
    () => adapter.getTask(taskId!),
    { enabled: !!taskId, retry: 1 }
  )

  const terminateMutation = useMutation(
    () => adapter.terminateTask(taskId!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['task', taskId, mode, backendOk])
        queryClient.invalidateQueries(['tasks', mode, backendOk])
        setConfirmTerminate(false)
        toast.success('Termination requested.')
      },
    }
  )

  if (!taskId) return <p className="text-[var(--text-muted)]">Missing task ID.</p>
  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Tasks', href: '/app/tasks' }, { label: '…' }]} />
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </motion.div>
    )
  }
  if (isError || !task) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Tasks', href: '/app/tasks' }, { label: taskId }]} />
        <Card className="border-[var(--error)]/30 bg-[var(--error)]/5">
          <p className="text-[var(--error)] font-medium">Task not found or failed to load.</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => refetch()}>Retry</Button>
        </Card>
        <Link to="/app/tasks"><Button variant="ghost" size="sm">← Back to Tasks</Button></Link>
      </motion.div>
    )
  }

  const isRunning = task.status === 'PENDING' || task.status === 'STARTED'
  const statusVariant = task.status === 'SUCCESS' ? 'success' : task.status === 'FAILURE' || task.status === 'REVOKED' ? 'error' : 'warning'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Tasks', href: '/app/tasks' }, { label: `Task ${taskId}` }]} />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="absolute inset-0 bg-[var(--accent-gradient)] opacity-[0.05]" aria-hidden />
        <div className="relative flex flex-wrap items-center gap-3">
          <Link to="/app/tasks" className="text-small text-[var(--text-muted)] hover:text-[var(--text-primary)]">← Tasks</Link>
          <h1 className="text-display text-[var(--text-primary)]">Task {taskId}</h1>
          <Badge variant={statusVariant}>{task.status ?? '—'}</Badge>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-tertiary)]/30">
          <span className="font-semibold text-[var(--text-primary)]">Status</span>
          <Badge variant={statusVariant}>{task.status ?? '—'}</Badge>
        </div>
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <span className="text-small text-[var(--text-muted)]">Completed at</span>
          <p className="text-body text-[var(--text-primary)] mt-1">{task.completed_at ? new Date(task.completed_at).toLocaleString() : '—'}</p>
        </div>
        <div className="px-6 py-4">
          <span className="text-small text-[var(--text-muted)]">Metadata</span>
          <pre className="mt-2 text-small text-[var(--text-secondary)] overflow-x-auto rounded-xl bg-[var(--bg-tertiary)] p-4">
            {typeof task.metadata === 'object' && task.metadata !== null
              ? JSON.stringify(task.metadata, null, 2)
              : String(task.metadata ?? '—')}
          </pre>
        </div>
      </Card>

      {isRunning && (
        <Card>
          <h2 className="text-h3 text-[var(--text-primary)] mb-3">Terminate task</h2>
          <Button variant="danger" size="md" onClick={() => setConfirmTerminate(true)}>Terminate task</Button>
        </Card>
      )}

      <Modal open={confirmTerminate} onClose={() => setConfirmTerminate(false)} title="Confirm terminate" size="sm">
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">Are you sure you want to terminate this task?</p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setConfirmTerminate(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => terminateMutation.mutate()} loading={terminateMutation.isLoading}>
              {terminateMutation.isLoading ? 'Terminating…' : 'Yes, terminate'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
