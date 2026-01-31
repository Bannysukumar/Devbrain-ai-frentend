import { useAppMode } from '@/context/AppModeContext'
import { useDataAdapter } from '@/adapters/useDataAdapter'
import { hasApiBaseUrl } from '@/adapters'

export function ApiBanner() {
  const { isDemo, isProduction } = useAppMode()
  const { isDemoOffline } = useDataAdapter()
  const hasApi = hasApiBaseUrl()

  if (isProduction && !hasApi) return null

  if (isProduction && hasApi) {
    return (
      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-200 text-sm">
        <strong>Production Mode:</strong> Connected to live knowledge sources.
      </div>
    )
  }

  if (isDemo) {
    return (
      <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm space-y-1">
        <p><strong>Demo Mode:</strong> Sample knowledge is loaded for demonstration.</p>
        {isDemoOffline && (
          <p className="text-amber-300/90">Backend offline — running in Demo Offline mode with local sample data.</p>
        )}
      </div>
    )
  }

  if (!hasApi) {
    return (
      <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm">
        <strong>API not configured.</strong> Set <code className="bg-slate-800 px-1 rounded">VITE_API_BASE_URL</code> in{' '}
        <code className="bg-slate-800 px-1 rounded">.env</code> to your Ragpi backend URL and restart the dev server.
      </div>
    )
  }

  return null
}
