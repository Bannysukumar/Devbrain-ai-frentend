import * as client from '@/api/client'
import type { DataAdapter } from './types'

export const apiAdapter: DataAdapter = {
  healthcheck: client.healthcheck,
  listSources: client.listSources,
  createSource: client.createSource,
  getSource: client.getSource,
  updateSource: client.updateSource,
  deleteSource: client.deleteSource,
  listDocuments: client.listDocuments,
  searchSource: client.searchSource,
  unifiedSearch: client.unifiedSearch,
  chat: client.chat,
  listTasks: client.listTasks,
  getTask: client.getTask,
  terminateTask: client.terminateTask,
}
