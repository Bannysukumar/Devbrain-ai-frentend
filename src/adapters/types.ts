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
} from '@/api/types'

export interface DataAdapter {
  healthcheck(): Promise<HealthcheckResponse>
  listSources(): Promise<SourceMetadata[]>
  createSource(payload: CreateSourcePayload): Promise<SourceTaskResponse>
  getSource(sourceName: string): Promise<SourceMetadata>
  updateSource(sourceName: string, payload: UpdateSourcePayload): Promise<SourceTaskResponse>
  deleteSource(sourceName: string): Promise<void>
  listDocuments(sourceName: string, limit?: number, offset?: number): Promise<Document[]>
  searchSource(sourceName: string, query: string, top_k?: number): Promise<Document[]>
  unifiedSearch(query: string, sourceNames: string[], topKPerSource?: number): Promise<Record<string, Document[]>>
  chat(payload: CreateChatPayload): Promise<ChatResponse>
  listTasks(): Promise<Task[]>
  getTask(taskId: string): Promise<Task>
  terminateTask(taskId: string): Promise<{ message?: string }>
}
