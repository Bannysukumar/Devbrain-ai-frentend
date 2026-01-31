import type { HealthcheckResponse, SourceMetadata, CreateSourcePayload, UpdateSourcePayload, SourceTaskResponse, Document, Task, CreateChatPayload, ChatResponse } from '@/api/types'
import {
  demoSources,
  demoDocuments,
  demoTasks,
  getDemoSearchResults,
  getDemoChatResponse,
} from '@/data/demoDataset'
import type { DataAdapter } from './types'

const okHealth: HealthcheckResponse = {
  api: { status: 'ok' },
  redis: { status: 'ok' },
  postgres: { status: 'ok' },
  workers: { status: 'ok' },
}

export const demoAdapter: DataAdapter = {
  async healthcheck(): Promise<HealthcheckResponse> {
    return okHealth
  },

  async listSources(): Promise<SourceMetadata[]> {
    return [...demoSources]
  },

  async createSource(_payload: CreateSourcePayload): Promise<SourceTaskResponse> {
    return {
      task_id: null,
      source: demoSources[0],
      message: 'Demo: source creation is simulated. Use real API in Current/Production mode.',
    }
  },

  async getSource(sourceName: string): Promise<SourceMetadata> {
    const s = demoSources.find((x) => x.name === sourceName)
    if (!s) throw new Error(`Demo source not found: ${sourceName}`)
    return { ...s }
  },

  async updateSource(sourceName: string, _payload: UpdateSourcePayload): Promise<SourceTaskResponse> {
    const s = demoSources.find((x) => x.name === sourceName)
    if (!s) throw new Error(`Demo source not found: ${sourceName}`)
    return { task_id: null, source: { ...s }, message: 'Demo: update simulated.' }
  },

  async deleteSource(_sourceName: string): Promise<void> {
    // no-op; demo data is read-only
  },

  async listDocuments(_sourceName: string, limit = 100, offset = 0): Promise<Document[]> {
    return demoDocuments.slice(offset, offset + limit)
  },

  async searchSource(sourceName: string, query: string, top_k = 10): Promise<Document[]> {
    const bySource = getDemoSearchResults(query, [sourceName], top_k)
    return bySource[sourceName] ?? []
  },

  async unifiedSearch(query: string, sourceNames: string[], topKPerSource = 5): Promise<Record<string, Document[]>> {
    return getDemoSearchResults(query, sourceNames, topKPerSource)
  },

  async chat(payload: CreateChatPayload): Promise<ChatResponse> {
    const lastUser = payload.messages?.filter((m) => m.role === 'user').pop()
    const question = lastUser?.content ?? ''
    return getDemoChatResponse(question)
  },

  async listTasks(): Promise<Task[]> {
    return [...demoTasks]
  },

  async getTask(taskId: string): Promise<Task> {
    const t = demoTasks.find((x) => x.id === taskId)
    if (!t) throw new Error(`Demo task not found: ${taskId}`)
    return { ...t }
  },

  async terminateTask(_taskId: string): Promise<{ message?: string }> {
    return { message: 'Demo: terminate simulated.' }
  },
}
