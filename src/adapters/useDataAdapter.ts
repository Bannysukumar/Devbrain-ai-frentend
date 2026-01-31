import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { healthcheck } from '@/api/client'
import { useAppMode } from '@/context/AppModeContext'
import { getDataAdapter } from './resolver'

function isHealthy(data: Awaited<ReturnType<typeof healthcheck>> | undefined): boolean {
  if (!data) return false
  const api = data?.api?.status === 'ok'
  const redis = data?.redis?.status === 'ok'
  const postgres = data?.postgres?.status === 'ok'
  const workers = data?.workers?.status === 'ok' || data?.workers?.status === 'skipped'
  return !!(api && redis && postgres && workers)
}

export function useDataAdapter() {
  const { mode, setMode, isDemo, isProduction, isCurrent } = useAppMode()
  const { data: health, isError: healthError, isLoading: healthLoading } = useQuery(
    'health',
    healthcheck,
    { retry: 1, staleTime: 30_000, refetchInterval: 60_000 }
  )
  const backendOk = !healthError && isHealthy(health)
  const isDemoOffline = isDemo && !backendOk
  const adapter = useMemo(() => getDataAdapter(mode, backendOk), [mode, backendOk])

  return {
    adapter,
    backendOk,
    isDemoOffline,
    healthLoading,
    mode,
    setMode,
    isDemo,
    isProduction,
    isCurrent,
  }
}
