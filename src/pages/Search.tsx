import { useState, useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useAppMode } from '@/context/AppModeContext'
import { useDataAdapter } from '@/adapters/useDataAdapter'
import { getToolTypeFromConnector, type SourceWithToolType } from '@/api/types'
import { suggestedSearchQueries } from '@/data/demoDataset'
import { ToolTypeBadge } from '@/components/ToolTypeBadge'
import { loadSettings } from '@/store/settings'
import { motion } from 'framer-motion'
import { Card, Button, Badge, Breadcrumb, EmptyState, Skeleton } from '@/components/ui'
import type { Document } from '@/api/types'

const DEBOUNCE_MS = 400

interface DocWithMeta extends Document {
  _sourceName: string
  _scorePercent?: number
  _matchedKeywords?: string[]
}

function getUpdatedAt(d: Document): string | undefined {
  return d.updated_at ?? d.created_at
}

function daysAgo(iso: string): number {
  const t = new Date(iso).getTime()
  return (Date.now() - t) / (24 * 60 * 60 * 1000)
}

function computeRelevance(query: string, doc: Document): { scorePercent: number; keywords: string[] } {
  const q = query.trim().toLowerCase()
  if (!q) return { scorePercent: 0, keywords: [] }
  const terms = q.split(/\s+/).filter(Boolean)
  const content = ((doc.content ?? '') + ' ' + (doc.title ?? '')).toLowerCase()
  const matched = terms.filter((t) => content.includes(t))
  const scorePercent = terms.length ? Math.round((matched.length / terms.length) * 100) : 0
  return { scorePercent, keywords: matched }
}

export function Search() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [groupBySource, setGroupBySource] = useState(true)
  const [selectedSourceNames, setSelectedSourceNames] = useState<string[]>([])
  const [topK, setTopK] = useState(5)
  const [filterToolType, setFilterToolType] = useState<string>('')
  const [projectFilter, setProjectFilter] = useState<string>('')
  const [moduleFilter, setModuleFilter] = useState<string>('')
  const [result, setResult] = useState<Record<string, Document[]>>({})
  const [loading, setLoading] = useState(false)

  const settings = loadSettings()
  const { mode, isDemo } = useAppMode()
  const { adapter, backendOk } = useDataAdapter()
  const { data: sources = [], isLoading: sourcesLoading, isError: sourcesError, refetch: refetchSources } = useQuery(
    ['sources', mode, backendOk],
    () => adapter.listSources(),
    { retry: 1 }
  )
  const sourcesWithType = useMemo(
    () =>
      sources.map((s) => ({
        ...s,
        toolType: getToolTypeFromConnector(s.connector),
        project: settings.sourceProject[s.name] ?? '',
        module: settings.sourceModule[s.name] ?? '',
      })) as (SourceWithToolType & { project: string; module: string })[],
    [sources, settings.sourceProject, settings.sourceModule]
  )

  const projects = useMemo(() => {
    const set = new Set<string>()
    sourcesWithType.forEach((s) => {
      if (s.project) set.add(s.project)
    })
    return Array.from(set).sort()
  }, [sourcesWithType])
  const modules = useMemo(() => {
    const set = new Set<string>()
    sourcesWithType.forEach((s) => {
      if (s.module) set.add(s.module)
    })
    return Array.from(set).sort()
  }, [sourcesWithType])

  const filteredByTool =
    filterToolType === '' ? sourcesWithType : sourcesWithType.filter((s) => s.toolType === filterToolType)
  const filteredByProject =
    projectFilter === '' ? filteredByTool : filteredByTool.filter((s) => s.project === projectFilter)
  const filteredByModule =
    moduleFilter === '' ? filteredByProject : filteredByProject.filter((s) => s.module === moduleFilter)

  const allNames = filteredByModule.map((s) => s.name)
  const effectiveNames = selectedSourceNames.length > 0 ? selectedSourceNames.filter((n) => allNames.includes(n)) : allNames

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [query])

  const effectivePreferRecent = mode === 'PRODUCTION' ? (settings.preferMostRecentSources !== false) : settings.preferMostRecentSources

  useEffect(() => {
    if (!debouncedQuery.trim() || effectiveNames.length === 0) {
      setResult({})
      return
    }
    setLoading(true)
    const priority = settings.sourcePriority
    const getTool = (name: string) => getToolTypeFromConnector(sources.find((s) => s.name === name)?.connector ?? { type: 'sitemap' } as any)
    adapter.unifiedSearch(debouncedQuery.trim(), effectiveNames, topK)
      .then((raw) => {
        const preferRecent = effectivePreferRecent
        const sourceOrder = [...effectiveNames].sort(
          (a, b) => priority.indexOf(getTool(a)) - priority.indexOf(getTool(b))
        )
        const ordered: Record<string, Document[]> = {}
        sourceOrder.forEach((name) => {
          let docs = raw[name] ?? []
          if (preferRecent) {
            docs = [...docs].sort((a, b) => {
              const ta = new Date(getUpdatedAt(a) ?? 0).getTime()
              const tb = new Date(getUpdatedAt(b) ?? 0).getTime()
              return tb - ta
            })
          }
          ordered[name] = docs
        })
        setResult(ordered)
      })
      .finally(() => setLoading(false))
  }, [debouncedQuery, effectiveNames.join(','), topK, settings.sourcePriority, effectivePreferRecent, sources, adapter])

  const toggleSource = (name: string) => {
    setSelectedSourceNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  const allResults: DocWithMeta[] = useMemo(() => {
    const list: DocWithMeta[] = []
    Object.entries(result).forEach(([sourceName, docs]) => {
      const q = debouncedQuery.trim()
      docs.forEach((d) => {
        const { scorePercent, keywords } = computeRelevance(q, d)
        list.push({
          ...d,
          _sourceName: sourceName,
          _scorePercent: d.score != null ? Math.round(d.score * 100) : scorePercent,
          _matchedKeywords: keywords.length ? keywords : undefined,
        })
      })
    })
    if (effectivePreferRecent) {
      list.sort((a, b) => {
        const ta = new Date(getUpdatedAt(a) ?? 0).getTime()
        const tb = new Date(getUpdatedAt(b) ?? 0).getTime()
        return tb - ta
      })
    }
    return list
  }, [result, debouncedQuery, effectivePreferRecent])

  const sourceCountWithResults = Object.keys(result).length
  const showConflictWarning = sourceCountWithResults >= 2
  const freshnessDays = settings.freshnessThresholdDays

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <Breadcrumb items={[{ label: 'App', href: '/app/dashboard' }, { label: 'Search' }]} />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[var(--accent-gradient)] opacity-[0.05]" aria-hidden />
        <div className="relative">
          <h1 className="text-display text-[var(--text-primary)]">Context-aware Unified Search</h1>
          <p className="text-body text-[var(--text-muted)] mt-2">
            Project and tool filters, debounced semantic search, relevance and freshness.
          </p>
        </div>
      </div>
      {sourcesError && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <div className="flex items-center justify-between">
            <span className="text-amber-200 text-sm">Failed to load sources.</span>
            <Button size="sm" variant="secondary" onClick={() => refetchSources()}>Retry</Button>
          </div>
        </Card>
      )}

      {isDemo && suggestedSearchQueries.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <p className="text-small text-[var(--text-muted)] mb-2">Suggested queries (Demo):</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSearchQueries.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => { setQuery(q); setDebouncedQuery(q); }}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-small text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
              >
                {q}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setDebouncedQuery(query.trim())}
            placeholder="Search (debounced)…"
            className="flex-1 min-w-[240px] px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
          <select
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="px-4 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]"
          >
            {[3, 5, 10].map((n) => (
              <option key={n} value={n}>top {n} per source</option>
            ))}
          </select>
          <Button onClick={() => setDebouncedQuery(query.trim())} disabled={loading || !query.trim()} size="md">
            {loading ? 'Searching…' : 'Search'}
          </Button>
        </div>
      </Card>

      <Card>
        <p className="text-small text-[var(--text-muted)] mb-3">View & filters</p>
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-small text-[var(--text-secondary)]">
            <input type="radio" name="view" checked={groupBySource} onChange={() => setGroupBySource(true)} className="rounded-full border-[var(--border)] text-[var(--accent-primary)]" />
            Group by Source
          </label>
          <label className="flex items-center gap-2 text-small text-[var(--text-secondary)]">
            <input type="radio" name="view" checked={!groupBySource} onChange={() => setGroupBySource(false)} className="rounded-full border-[var(--border)] text-[var(--accent-primary)]" />
            All Combined
          </label>
          <span className="text-[var(--border)]">|</span>
          <select value={filterToolType} onChange={(e) => setFilterToolType(e.target.value)} className="px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] text-small">
            <option value="">All types</option>
            <option value="docs">docs</option>
            <option value="code">code</option>
            <option value="issues">issues</option>
            <option value="chats">chats</option>
          </select>
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] text-small">
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] text-small">
            <option value="">All modules</option>
            {modules.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        <p className="text-small text-[var(--text-muted)] mb-2">Sources to search (leave all selected to search all)</p>
        {sourcesLoading ? (
          <Skeleton className="h-10 w-3/4 rounded-xl" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {filteredByModule.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => toggleSource(s.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  selectedSourceNames.length === 0 || selectedSourceNames.includes(s.name)
                    ? 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]'
                    : 'bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <ToolTypeBadge toolType={s.toolType} />
                {s.name}
              </button>
            ))}
            {sourcesWithType.length === 0 && (
              <span className="text-[var(--text-muted)] text-small">No sources. Create sources first.</span>
            )}
          </div>
        )}
      </Card>

      {showConflictWarning && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <p className="text-amber-200 text-small">Potential conflict: check sources — multiple sources returned results for this query.</p>
        </Card>
      )}

      {loading && (
        <Card className="p-8 text-center">
          <div className="inline-block w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin mb-2" />
          <p className="text-[var(--text-muted)]">Searching…</p>
        </Card>
      )}

      {!loading && debouncedQuery.trim() && effectiveNames.length > 0 && allResults.length === 0 && Object.keys(result).length > 0 && (
        <Card>
          <EmptyState icon="🔍" title="No results" description={`No results found for "${debouncedQuery}".`} />
        </Card>
      )}

      {!loading && (groupBySource ? Object.keys(result).length > 0 : allResults.length > 0) && (
        <div className="space-y-4">
          {groupBySource ? (
            Object.entries(result).map(([sourceName, docs]) => {
              const withMeta = docs.map((d) => {
                const { scorePercent, keywords } = computeRelevance(debouncedQuery, d)
                return {
                  ...d,
                  _scorePercent: d.score != null ? Math.round(d.score * 100) : scorePercent,
                  _matchedKeywords: keywords.length ? keywords : undefined,
                } as DocWithMeta
              })
              return (
                <Card key={sourceName} padding="none" className="overflow-hidden">
                  <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-2 bg-[var(--bg-tertiary)]/50">
                    <span className="font-semibold text-[var(--text-primary)]">{sourceName}</span>
                    <ToolTypeBadge toolType={sourcesWithType.find((s) => s.name === sourceName)?.toolType ?? 'docs'} />
                  </div>
                  <ul className="divide-y divide-[var(--border)]">
                    {withMeta.map((d) => {
                      const updated = getUpdatedAt(d)
                      const outdated = updated ? daysAgo(updated) > freshnessDays : false
                      return (
                        <li key={d.id} className="p-6 hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {d._scorePercent != null && (
                              <Badge variant="info">Relevance {d._scorePercent}%</Badge>
                            )}
                            {updated && (
                              <span className="text-xs text-[var(--text-muted)]">
                                Updated {new Date(updated).toLocaleDateString()}
                              </span>
                            )}
                            {outdated && (
                              <Badge variant="warning">Possibly outdated</Badge>
                            )}
                          </div>
                          {d._matchedKeywords && d._matchedKeywords.length > 0 && (
                            <p className="text-[var(--text-muted)] text-xs mb-1">
                              Matched: {d._matchedKeywords.join(', ')}
                            </p>
                          )}
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[var(--accent-primary)] hover:underline"
                          >
                            {d.title || d.id}
                          </a>
                          <p className="text-[var(--text-muted)] text-small mt-1 line-clamp-2">{d.content?.slice(0, 200)}…</p>
                        </li>
                      )
                    })}
                  </ul>
                </Card>
              )
            })
          ) : (
            <Card padding="none" className="overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border)] font-semibold text-[var(--text-primary)] bg-[var(--bg-tertiary)]/50">
                All results ({allResults.length})
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {allResults.map((d) => {
                  const updated = getUpdatedAt(d)
                  const outdated = updated ? daysAgo(updated) > freshnessDays : false
                  return (
                    <li key={`${d._sourceName}-${d.id}`} className="p-6 hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs text-[var(--text-muted)]">{d._sourceName}</span>
                        <ToolTypeBadge toolType={sourcesWithType.find((s) => s.name === d._sourceName)?.toolType ?? 'docs'} />
                        {d._scorePercent != null && (
                          <Badge variant="default">{d._scorePercent}%</Badge>
                        )}
                        {updated && (
                          <span className="text-xs text-[var(--text-muted)]">{new Date(updated).toLocaleDateString()}</span>
                        )}
                        {outdated && (
                          <Badge variant="warning">Possibly outdated</Badge>
                        )}
                      </div>
                      {d._matchedKeywords && d._matchedKeywords.length > 0 && (
                        <p className="text-[var(--text-muted)] text-xs mb-1">Matched: {d._matchedKeywords.join(', ')}</p>
                      )}
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[var(--accent-primary)] hover:underline"
                      >
                        {d.title || d.id}
                      </a>
                      <p className="text-[var(--text-muted)] text-small mt-1 line-clamp-2">{d.content?.slice(0, 200)}…</p>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )}
        </div>
      )}

      {!loading && debouncedQuery.trim() && effectiveNames.length === 0 && (
        <Card>
          <EmptyState
            icon="📚"
            title="No sources selected"
            description="Create sources first or assign Project/Module in Settings."
          />
        </Card>
      )}
    </motion.div>
  )
}
