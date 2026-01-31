/**
 * Local demo dataset for Demo Mode (offline / judge-ready).
 * Realistic sample data: onboarding, architecture, incident excerpt, issue ticket, README.
 */

import type { SourceMetadata, Document, Task, ChatResponse } from '@/api/types'
import type { RagpiConnector } from '@/api/types'

const now = new Date().toISOString()
const past = new Date(Date.now() - 86400000 * 7).toISOString()

export const demoSources: SourceMetadata[] = [
  {
    id: 'demo-docs-id',
    name: 'demo-docs',
    description: 'Demo docs source (S4: documentation)',
    num_docs: 3,
    last_task_id: 'task-demo-docs',
    created_at: past,
    updated_at: now,
    connector: { type: 'sitemap', sitemap_url: 'https://docs.python.org/3/sitemap.xml' } as RagpiConnector,
  },
  {
    id: 'demo-code-id',
    name: 'demo-code',
    description: 'Demo code source (S4: code repos)',
    num_docs: 2,
    last_task_id: 'task-demo-code',
    created_at: past,
    updated_at: now,
    connector: { type: 'github_readme', repo_owner: 'facebook', repo_name: 'react', include_root: true } as RagpiConnector,
  },
  {
    id: 'demo-issues-id',
    name: 'demo-issues',
    description: 'Demo issues source (S4: issue tracker)',
    num_docs: 2,
    last_task_id: 'task-demo-issues',
    created_at: past,
    updated_at: now,
    connector: { type: 'github_issues', repo_owner: 'tiangolo', repo_name: 'fastapi', state: 'all' } as RagpiConnector,
  },
  {
    id: 'demo-chats-id',
    name: 'demo-chats',
    description: 'Demo chats/API source (S4: chat logs)',
    num_docs: 2,
    last_task_id: 'task-demo-chats',
    created_at: past,
    updated_at: now,
    connector: { type: 'rest_api', url: 'https://jsonplaceholder.typicode.com/posts', method: 'GET', title_field: 'title', content_field: 'body' } as RagpiConnector,
  },
]

export const demoDocuments: Document[] = [
  {
    id: 'doc-onboarding',
    title: 'Onboarding notes – DevBrain AI',
    content: 'Onboarding: 1) Set up VITE_API_BASE_URL to your Ragpi backend. 2) Create sources (docs, code, issues, chats). 3) Wait for sync tasks to complete. 4) Use Unified Search and Chat. Architecture: React + TypeScript frontend, Ragpi backend for ingestion and RAG.',
    url: 'https://example.com/onboarding',
    created_at: past,
    updated_at: now,
    score: 0.92,
  },
  {
    id: 'doc-architecture',
    title: 'Architecture overview',
    content: 'DevBrain AI architecture: frontend (React, Tailwind, React Query), backend Ragpi (Python, FastAPI). Data flow: sources → connectors → ingestion tasks → vector store. Search and chat use the same index. Deployment: Docker, optional aaPanel.',
    url: 'https://example.com/architecture',
    created_at: past,
    updated_at: now,
    score: 0.88,
  },
  {
    id: 'doc-incident',
    title: 'Incident chat excerpt – 2024-01',
    content: 'Incident fix: Root cause was Redis connection timeout under load. We increased pool size and added retry with backoff. Deployment rollback was not needed; fix deployed to staging first, then production. Post-mortem doc: PM-2024-01.',
    url: 'https://example.com/incident',
    created_at: past,
    updated_at: now,
    score: 0.85,
  },
  {
    id: 'doc-issue',
    title: 'Issue #42 – Auth documentation',
    content: 'Issue ticket summary: Where is auth documented? Current state: Login/signup flows are in /auth. API keys (if used) go in request headers. Backend uses env for secrets. Action: Add a short "Auth" section to the main README.',
    url: 'https://example.com/issues/42',
    created_at: past,
    updated_at: now,
    score: 0.82,
  },
  {
    id: 'doc-readme',
    title: 'README – Getting started',
    content: 'README snippets: How do we deploy? Use docker-compose for local; for production see DEPLOYMENT-AAPANEL.md. Environment: .env with VITE_API_BASE_URL. Scripts: npm run dev, npm run build. Health: GET /healthcheck.',
    url: 'https://example.com/readme',
    created_at: past,
    updated_at: now,
    score: 0.9,
  },
]

/** Query (lowercase trim) -> list of document IDs to show per source. Then we map IDs to docs. */
const searchResultsByQuery: Record<string, Record<string, string[]>> = {
  'how do we deploy': { 'demo-docs': ['doc-readme'], 'demo-code': ['doc-readme'] },
  'deploy': { 'demo-docs': ['doc-readme', 'doc-architecture'], 'demo-code': ['doc-readme'] },
  'auth documented': { 'demo-docs': ['doc-onboarding'], 'demo-issues': ['doc-issue'] },
  'where is auth': { 'demo-issues': ['doc-issue'], 'demo-docs': ['doc-onboarding'] },
  'incident fix': { 'demo-chats': ['doc-incident'], 'demo-docs': ['doc-incident'] },
  'architecture': { 'demo-docs': ['doc-architecture', 'doc-onboarding'] },
  'onboarding': { 'demo-docs': ['doc-onboarding'] },
}

const docById = new Map(demoDocuments.map((d) => [d.id, d]))

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Get demo search results: query -> { sourceName: Document[] }. */
export function getDemoSearchResults(
  query: string,
  sourceNames: string[],
  topKPerSource: number
): Record<string, Document[]> {
  const key = normalizeQuery(query)
  const out: Record<string, Document[]> = {}
  for (const name of sourceNames) {
    let ids: string[] = []
    for (const [q, bySource] of Object.entries(searchResultsByQuery)) {
      if (key.includes(q) || q.includes(key)) {
        ids = bySource[name] ?? []
        break
      }
    }
    if (ids.length === 0) ids = ['doc-onboarding', 'doc-architecture', 'doc-readme'].filter(() => true)
    const docs = ids
      .map((id) => docById.get(id))
      .filter(Boolean) as Document[]
    out[name] = docs.slice(0, topKPerSource)
  }
  return out
}

/** Chat: question (lowercase) -> response with optional citations text. */
const chatResponsesByQuestion: Record<string, { message: string; citations?: string[] }> = {
  'how do we deploy': {
    message: 'Deployment is done via Docker for local development. For production, see DEPLOYMENT-AAPANEL.md. Set VITE_API_BASE_URL in .env to your Ragpi backend. Use docker-compose for full stack.',
    citations: ['README – Getting started', 'Architecture overview'],
  },
  'where is auth documented': {
    message: 'Auth is documented in the onboarding notes and in issue #42. Login/signup flows live under /auth. API keys (if used) are sent in request headers; backend uses env for secrets.',
    citations: ['Onboarding notes', 'Issue #42 – Auth documentation'],
  },
  'what was the incident fix': {
    message: 'The incident was fixed by addressing Redis connection timeouts under load: we increased the connection pool size and added retry with backoff. The fix was deployed to staging first, then production; no rollback was needed.',
    citations: ['Incident chat excerpt – 2024-01'],
  },
  'how do i get started': {
    message: 'Get started by: 1) Setting VITE_API_BASE_URL to your Ragpi backend, 2) Creating sources (docs, code, issues, chats), 3) Waiting for sync tasks to complete, 4) Using Unified Search and Chat.',
    citations: ['Onboarding notes – DevBrain AI'],
  },
  'what is the main purpose': {
    message: 'DevBrain AI unifies technical knowledge from docs, code repos, issue trackers, and chat logs in one place. It provides semantic search and RAG-powered chat grounded in your knowledge base.',
    citations: ['Onboarding notes', 'Architecture overview'],
  },
}

function normalizeQuestion(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function getDemoChatResponse(question: string): ChatResponse {
  const key = normalizeQuestion(question)
  for (const [k, v] of Object.entries(chatResponsesByQuestion)) {
    if (key.includes(k) || k.includes(key)) {
      const msg = v.citations?.length
        ? `${v.message}\n\n[Demo citations: ${v.citations.join(', ')}]`
        : v.message
      return { message: msg }
    }
  }
  return {
    message: 'This is a demo response. In a full run, the RAG backend would answer from your knowledge base. Try: "How do we deploy?", "Where is auth documented?", or "What was the incident fix?"',
  }
}

export const demoTasks: Task[] = [
  { id: 'task-demo-docs', status: 'SUCCESS', completed_at: now, metadata: { source: 'demo-docs' } },
  { id: 'task-demo-code', status: 'SUCCESS', completed_at: now, metadata: { source: 'demo-code' } },
  { id: 'task-demo-issues', status: 'STARTED', completed_at: null, metadata: { source: 'demo-issues' } },
  { id: 'task-demo-chats', status: 'SUCCESS', completed_at: past, metadata: { source: 'demo-chats' } },
]

export const suggestedSearchQueries = [
  'How do we deploy?',
  'Where is auth documented?',
  'What was the incident fix?',
  'Architecture overview',
  'Onboarding steps',
]

export const suggestedChatQuestions = [
  'How do we deploy?',
  'Where is auth documented?',
  'What was the incident fix?',
  'How do I get started?',
  'What is the main purpose of this project?',
]
