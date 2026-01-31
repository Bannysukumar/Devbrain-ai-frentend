import type { AppMode } from '@/lib/mode'
import { apiAdapter } from './apiAdapter'
import { demoAdapter } from './demoAdapter'
import type { DataAdapter } from './types'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * Resolves the data adapter to use based on mode and backend availability.
 * - CURRENT: always apiAdapter (existing behavior).
 * - DEMO: apiAdapter if backend is OK, else demoAdapter (offline demo).
 * - PRODUCTION: apiAdapter only; caller must enforce API URL (blocking error if missing).
 */
export function getDataAdapter(
  mode: AppMode,
  backendOk: boolean
): DataAdapter {
  if (mode === 'PRODUCTION') return apiAdapter
  if (mode === 'DEMO' && !backendOk) return demoAdapter
  return apiAdapter
}

export function hasApiBaseUrl(): boolean {
  return apiBaseUrl.trim().length > 0
}

export function getApiBaseUrl(): string {
  return apiBaseUrl
}
