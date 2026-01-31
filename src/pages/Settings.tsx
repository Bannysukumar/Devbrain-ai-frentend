import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { listSources } from '@/api/client'
import { loadSettings, saveSettings, DEFAULT_SOURCE_PRIORITY } from '@/store/settings'
import type { AppSettings } from '@/store/settings'
import { getToolTypeFromConnector } from '@/api/types'
import { ToolTypeBadge } from '@/components/ToolTypeBadge'
import toast from 'react-hot-toast'
import { Breadcrumb, Card, CardHeader, Button, Input } from '@/components/ui'

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings())
  const { data: sources = [] } = useQuery('sources', listSources, { retry: 1 })
  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  const movePriority = (index: number, delta: number) => {
    const next = [...settings.sourcePriority]
    const j = index + delta
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    setSettings((s) => ({ ...s, sourcePriority: next }))
  }

  const handleSave = () => {
    saveSettings(settings)
    toast.success('Settings saved.')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto space-y-8">
      <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Settings' }]} />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[var(--accent-gradient)] opacity-[0.05]" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-display text-[var(--text-primary)]">Settings</h1>
            <p className="text-body text-[var(--text-muted)] mt-2">Source priority, freshness, and preferences.</p>
          </div>
          <Button size="md" onClick={handleSave}>Save settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Source priority" description="Order used when merging search results (first = highest priority)." />
          <ul className="space-y-2">
            {settings.sourcePriority.map((t, i) => (
              <li key={t} className="flex items-center gap-3 py-2">
                <span className="text-[var(--text-muted)] w-6">{i + 1}.</span>
                <ToolTypeBadge toolType={t} />
                <div className="flex gap-1 ml-auto">
                  <Button variant="ghost" size="sm" onClick={() => movePriority(i, -1)} disabled={i === 0}>↑</Button>
                  <Button variant="ghost" size="sm" onClick={() => movePriority(i, 1)} disabled={i === settings.sourcePriority.length - 1}>↓</Button>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="ghost" size="sm" className="text-[var(--accent-primary)] mt-2" onClick={() => setSettings((s) => ({ ...s, sourcePriority: [...DEFAULT_SOURCE_PRIORITY] }))}>
            Reset to default (code → docs → issues → chats)
          </Button>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Freshness" description={'"Possibly outdated" after (days)'} />
            <input
              type="number"
              min={1}
              max={365}
              value={settings.freshnessThresholdDays}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                if (!Number.isNaN(v)) {
                  setSettings((s) => ({ ...s, freshnessThresholdDays: Math.max(1, Math.min(365, v)) }))
                }
              }}
              className="w-24 px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            />
          </Card>

          <Card>
            <CardHeader title="Search preferences" />
            <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.preferMostRecentSources}
                onChange={(e) => {
                  setSettings((s) => ({ ...s, preferMostRecentSources: e.target.checked }))
                }}
                className="rounded border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--accent-primary)]"
              />
              Prefer most recent sources when merging results
            </label>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Source metadata (Project / Module)" description="Used in Unified Search filters. Assign project and module per source." />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="pb-3 pr-4 font-semibold text-[var(--text-primary)]">Source</th>
                <th className="pb-3 pr-4 font-semibold text-[var(--text-primary)]">Project</th>
                <th className="pb-3 font-semibold text-[var(--text-primary)]">Module</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {sources.map((src) => (
                <tr key={src.name} className="align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <ToolTypeBadge toolType={getToolTypeFromConnector(src.connector)} />
                      <span className="font-medium text-[var(--text-primary)]">{src.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Input
                      placeholder="Project"
                      value={settings.sourceProject[src.name] ?? ''}
                      onChange={(e) => {
                        setSettings((s) => ({
                          ...s,
                          sourceProject: { ...s.sourceProject, [src.name]: e.target.value.trim() },
                        }))
                      }}
                      className="min-w-[120px]"
                    />
                  </td>
                  <td className="py-3">
                    <Input
                      placeholder="Module"
                      value={settings.sourceModule[src.name] ?? ''}
                      onChange={(e) => {
                        setSettings((s) => ({
                          ...s,
                          sourceModule: { ...s.sourceModule, [src.name]: e.target.value.trim() },
                        }))
                      }}
                      className="min-w-[120px]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sources.length === 0 && (
          <p className="text-[var(--text-muted)] text-small pt-2">No sources yet. Create sources first; then assign project/module here.</p>
        )}
      </Card>
    </motion.div>
  )
}
