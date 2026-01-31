/**
 * DevBrain AI – API client for Ragpi backend.
 * Base URL from VITE_API_BASE_URL. All requests go to that origin.
 */

import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import type {
  HealthcheckResponse,
  SourceMetadata,
  CreateSourcePayload,
  UpdateSourcePayload,
  SourceTaskResponse,
  Document,
  Task,
  CreateChatPayload,
  ChatResponse,
} from './types'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''
if (!baseURL) {
  console.warn('VITE_API_BASE_URL is not set. API calls may fail.')
}

const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

function getApiKey(): string | undefined {
  return undefined
}

api.interceptors.request.use((config) => {
  const key = getApiKey()
  if (key) config.headers['x-api-key'] = key
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ detail?: string | { msg?: string }[] }>) => {
    // 409 Conflict (e.g. source already exists) – let the caller show a tailored message
    if (err.response?.status === 409) {
      return Promise.reject(err)
    }
    const msg = err.response?.data?.detail
    const str = typeof msg === 'string' ? msg : Array.isArray(msg) ? msg.map((e) => e?.msg).filter(Boolean).join(', ') : err.message || 'Request failed'
    toast.error(str)
    return Promise.reject(err)
  }
)

// —— Healthcheck ——
export async function healthcheck(): Promise<HealthcheckResponse> {
  const { data } = await api.get<HealthcheckResponse>('/healthcheck')
  return data
}

// —— Sources ——
export async function listSources(): Promise<SourceMetadata[]> {
  const { data } = await api.get<SourceMetadata[]>('/sources')
  return Array.isArray(data) ? data : []
}

export async function createSource(payload: CreateSourcePayload): Promise<SourceTaskResponse> {
  const { data } = await api.post<SourceTaskResponse>('/sources', payload)
  return data
}

export async function getSource(sourceName: string): Promise<SourceMetadata> {
  const { data } = await api.get<SourceMetadata>(`/sources/${encodeURIComponent(sourceName)}`)
  return data
}

export async function updateSource(sourceName: string, payload: UpdateSourcePayload): Promise<SourceTaskResponse> {
  const { data } = await api.put<SourceTaskResponse>(`/sources/${encodeURIComponent(sourceName)}`, payload)
  return data
}

export async function deleteSource(sourceName: string): Promise<void> {
  await api.delete(`/sources/${encodeURIComponent(sourceName)}`)
}

export async function listDocuments(sourceName: string, limit = 100, offset = 0): Promise<Document[]> {
  const { data } = await api.get<Document[]>(`/sources/${encodeURIComponent(sourceName)}/documents`, {
    params: { limit, offset },
  })
  return Array.isArray(data) ? data : []
}

export async function searchSource(sourceName: string, query: string, top_k = 10): Promise<Document[]> {
  if (!query.trim()) return []
  const { data } = await api.get<Document[]>(`/sources/${encodeURIComponent(sourceName)}/search`, {
    params: { query: query.trim(), top_k },
  })
  return Array.isArray(data) ? data : []
}

// —— Unified search: run search per source and merge (frontend-side) ——
export async function unifiedSearch(
  query: string,
  sourceNames: string[],
  topKPerSource = 5
): Promise<Record<string, Document[]>> {
  if (!query.trim() || sourceNames.length === 0) return {}
  const results = await Promise.allSettled(
    sourceNames.map((name) => searchSource(name, query, topKPerSource))
  )
  const out: Record<string, Document[]> = {}
  sourceNames.forEach((name, i) => {
    const r = results[i]
    out[name] = r.status === 'fulfilled' ? r.value : []
  })
  return out
}

// —— Chat ——
export async function chat(payload: CreateChatPayload): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>('/chat', payload)
  return data
}

// —— Tasks ——
export async function listTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks')
  return Array.isArray(data) ? data : []
}

export async function getTask(taskId: string): Promise<Task> {
  const { data } = await api.get<Task>(`/tasks/${encodeURIComponent(taskId)}`)
  return data
}

export async function terminateTask(taskId: string): Promise<{ message?: string }> {
  const { data } = await api.post<{ message?: string }>(`/tasks/${encodeURIComponent(taskId)}/terminate`)
  return data ?? {}
}
