import { createContext, useContext } from 'react'

const TabsContext = createContext<{ value: string; onChange: (v: string) => void } | null>(null)

export function Tabs({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex gap-1 p-1 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] ${className}`} role="tablist">
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)
  if (!ctx) return null
  const isActive = ctx.value === value
  return (
    <button
      type="button"
      role="tab"
      onClick={() => ctx.onChange(value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
      }`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)
  if (!ctx || ctx.value !== value) return null
  return <div className="pt-4">{children}</div>
}
