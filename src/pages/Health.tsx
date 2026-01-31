import { useQuery } from 'react-query'
import { healthcheck } from '@/api/client'
import { Skeleton } from '@/components/Skeleton'

export function Health() {
  const { data, isLoading, isError, isFetching, dataUpdatedAt, refetch } = useQuery(
    'health',
    healthcheck,
    { refetchInterval: 30_000, retry: 1 }
  )

  const isHealthy =
    !isError &&
    data?.api?.status === 'ok' &&
    data?.redis?.status === 'ok' &&
    data?.postgres?.status === 'ok' &&
    (data?.workers?.status === 'ok' || data?.workers?.status === 'skipped')

  const lastChecked = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString() : '—'

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-100">Health</h1>
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-100">Health</h1>
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-6">
          <p className="text-red-400 font-medium">Unable to reach backend.</p>
          <p className="text-slate-400 text-sm mt-1">Check VITE_API_BASE_URL and that Ragpi is running.</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-3 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-600 disabled:opacity-50"
          >
            {isFetching ? 'Retrying…' : 'Retry'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Health</h1>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">Last checked: {lastChecked}</span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-600 disabled:opacity-50"
          >
            {isFetching ? 'Checking…' : 'Refresh'}
          </button>
        </div>
      </div>

      <div
        className={`rounded-xl border p-6 ${
          isHealthy ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-red-500/50 bg-red-500/5'
        }`}
      >
        <p className={`text-lg font-semibold ${isHealthy ? 'text-emerald-400' : 'text-red-400'}`}>
          {isHealthy ? 'All systems operational' : 'Degraded or unavailable'}
        </p>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700">
          <h2 className="font-semibold text-slate-200">Response body</h2>
        </div>
        <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
          {JSON.stringify(data ?? {}, null, 2)}
        </pre>
      </div>
    </div>
  )
}
