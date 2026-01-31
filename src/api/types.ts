/**
 * DevBrain AI – API types aligned with Ragpi backend.
 * toolType (docs | code | issues | chats) is a frontend convention derived from connector.type.
 */

export type ToolType = 'docs' | 'code' | 'issues' | 'chats'

// —— Healthcheck ——
export interface HealthcheckResponse {
  api?: { status: string; [k: string]: unknown }
  redis?: { status: string; message?: string; [k: string]: unknown }
  postgres?: { status: string; message?: string; [k: string]: unknown }
  workers?: { status: string; active_workers?: number; message?: string; [k: string]: unknown }
}

// —— Connector configs (Ragpi backend) ——
export interface SitemapConnector {
  type: 'sitemap'
  sitemap_url: string
  include_pattern?: string | null
  exclude_pattern?: string | null
}

export interface GithubIssuesConnector {
  type: 'github_issues'
  repo_owner: string
  repo_name: string
  state?: 'all' | 'open' | 'closed'
  include_labels?: string[] | null
  exclude_labels?: string[] | null
  issue_age_limit?: number | null
}

export interface GithubReadmeConnector {
  type: 'github_readme'
  repo_owner: string
  repo_name: string
  include_root?: boolean
  sub_dirs?: string[] | null
  ref?: string | null
}

export interface GithubPdfConnector {
  type: 'github_pdf'
  repo_owner: string
  repo_name: string
  ref?: string | null
  path_filter?: string | null
}

export interface RestApiConnector {
  type: 'rest_api'
  url: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string> | null
  body?: Record<string, string> | null
  json_path?: string | null
  title_field?: string
  content_field?: string
  url_field?: string | null
  timeout?: number
}

export type RagpiConnector =
  | SitemapConnector
  | GithubIssuesConnector
  | GithubReadmeConnector
  | GithubPdfConnector
  | RestApiConnector

// —— Source ——
export interface SourceMetadata {
  id: string
  name: string
  description: string
  num_docs: number
  last_task_id: string | null
  created_at: string
  updated_at: string
  connector: RagpiConnector
}

export interface CreateSourcePayload {
  name: string
  description: string
  connector: RagpiConnector
}

export interface UpdateSourcePayload {
  sync?: boolean
  description?: string | null
  connector?: RagpiConnector | null
}

export interface SourceTaskResponse {
  task_id: string | null
  source: SourceMetadata
  message: string
}

// —— Document (backend may omit score/updated_at) ——
export interface Document {
  id: string
  content: string
  title: string
  url: string
  created_at: string
  updated_at?: string
  score?: number
  metadata?: Record<string, unknown>
}

// —— Task ——
export interface Task {
  id: string | null
  status: string | null
  completed_at: string | null
  metadata?: Record<string, unknown> | string | null
}

// —— Chat ——
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface CreateChatPayload {
  sources?: string[] | null
  model?: string
  messages: ChatMessage[]
}

export interface ChatResponse {
  message: string | null
}

// —— Frontend: source with derived toolType ——
export interface SourceWithToolType extends SourceMetadata {
  toolType: ToolType
}

/** Derive toolType from connector.type for UI badges */
export function getToolTypeFromConnector(connector: RagpiConnector): ToolType {
  switch (connector?.type) {
    case 'sitemap':
    case 'github_pdf':
      return 'docs'
    case 'github_readme':
      return 'code'
    case 'github_issues':
      return 'issues'
    case 'rest_api':
      return 'chats'
    default:
      return 'docs'
  }
}
