/**
 * Application mode: Current (default), Demo (judge-ready), or Production (real-world).
 * Persisted per user in localStorage.
 */

export type AppMode = 'CURRENT' | 'DEMO' | 'PRODUCTION'

const STORAGE_PREFIX = 'devbrain_mode_'

export function getModeStorageKey(userIdOrEmail: string): string {
  const safe = (userIdOrEmail || 'anonymous').trim().replace(/[^a-zA-Z0-9@._-]/g, '_').slice(0, 128)
  return `${STORAGE_PREFIX}${safe}`
}

export function getStoredMode(userIdOrEmail: string): AppMode {
  try {
    const key = getModeStorageKey(userIdOrEmail)
    const raw = localStorage.getItem(key)
    if (!raw) return 'CURRENT'
    const v = raw.toUpperCase()
    if (v === 'DEMO' || v === 'PRODUCTION') return v
    return 'CURRENT'
  } catch {
    return 'CURRENT'
  }
}

export function setStoredMode(userIdOrEmail: string, mode: AppMode): void {
  try {
    const key = getModeStorageKey(userIdOrEmail)
    localStorage.setItem(key, mode)
  } catch {}
}
