import type { ToolType } from '@/api/types'

const KEY = 'devbrain_settings'

export const DEFAULT_SOURCE_PRIORITY: ToolType[] = ['code', 'docs', 'issues', 'chats']
export const DEFAULT_FRESHNESS_DAYS = 90

export interface AppSettings {
  sourcePriority: ToolType[]
  freshnessThresholdDays: number
  preferMostRecentSources: boolean
  sourceProject: Record<string, string>
  sourceModule: Record<string, string>
}

const defaults: AppSettings = {
  sourcePriority: [...DEFAULT_SOURCE_PRIORITY],
  freshnessThresholdDays: DEFAULT_FRESHNESS_DAYS,
  preferMostRecentSources: false,
  sourceProject: {},
  sourceModule: {},
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...defaults }
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    return {
      sourcePriority: Array.isArray(parsed.sourcePriority) ? parsed.sourcePriority : defaults.sourcePriority,
      freshnessThresholdDays: typeof parsed.freshnessThresholdDays === 'number' ? parsed.freshnessThresholdDays : defaults.freshnessThresholdDays,
      preferMostRecentSources: typeof parsed.preferMostRecentSources === 'boolean' ? parsed.preferMostRecentSources : defaults.preferMostRecentSources,
      sourceProject: parsed.sourceProject && typeof parsed.sourceProject === 'object' ? parsed.sourceProject : {},
      sourceModule: parsed.sourceModule && typeof parsed.sourceModule === 'object' ? parsed.sourceModule : {},
    }
  } catch {
    return { ...defaults }
  }
}

export function saveSettings(s: AppSettings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {}
}