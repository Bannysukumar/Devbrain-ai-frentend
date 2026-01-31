import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { getStoredUser } from '@/lib/auth'
import { getStoredMode, setStoredMode, type AppMode } from '@/lib/mode'

interface AppModeContextValue {
  mode: AppMode
  setMode: (mode: AppMode) => void
  isDemo: boolean
  isProduction: boolean
  isCurrent: boolean
}

const AppModeContext = createContext<AppModeContextValue | null>(null)

function getUserIdOrEmail(): string {
  const user = getStoredUser()
  return user?.email ?? user?.id ?? 'anonymous'
}

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(() => getStoredMode(getUserIdOrEmail()))

  useEffect(() => {
    setModeState(getStoredMode(getUserIdOrEmail()))
  }, [])

  const setMode = useCallback((next: AppMode) => {
    const uid = getUserIdOrEmail()
    setStoredMode(uid, next)
    setModeState(next)
  }, [])

  const value: AppModeContextValue = {
    mode,
    setMode,
    isDemo: mode === 'DEMO',
    isProduction: mode === 'PRODUCTION',
    isCurrent: mode === 'CURRENT',
  }

  return <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
}

export function useAppMode(): AppModeContextValue {
  const ctx = useContext(AppModeContext)
  if (!ctx) {
    throw new Error('useAppMode must be used within AppModeProvider')
  }
  return ctx
}
