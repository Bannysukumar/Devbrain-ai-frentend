/**
 * Maps DevBrain UI (toolType + fields) to Ragpi CreateSourcePayload.
 * Single place for backend key mapping.
 */

import type {
  ToolType,
  CreateSourcePayload,
  RagpiConnector,
  SitemapConnector,
  GithubIssuesConnector,
  GithubReadmeConnector,
  RestApiConnector,
} from './types'

export type { CreateSourcePayload }

export interface SourceFormState {
  name: string
  toolType: ToolType
  description: string
  project?: string
  // Connector-specific (sanitized strings only)
  sitemap_url?: string
  repo_owner?: string
  repo_name?: string
  rest_api_url?: string
  github_state?: 'all' | 'open' | 'closed'
}

/** Ragpi: name must be [a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9], 3–50 chars */
function sanitizeSourceName(raw: string): string {
  const s = raw
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
  return s || 'source'
}

export function formToCreatePayload(state: SourceFormState): CreateSourcePayload {
  const connector = formToConnector(state)
  return {
    name: sanitizeSourceName(state.name),
    description: [state.description.trim(), state.project?.trim()].filter(Boolean).join(' | ') || state.name,
    connector,
  }
}

function formToConnector(state: SourceFormState): RagpiConnector {
  switch (state.toolType) {
    case 'docs': {
      const c: SitemapConnector = {
        type: 'sitemap',
        sitemap_url: (state.sitemap_url ?? '').trim() || 'https://example.com/sitemap.xml',
      }
      return c
    }
    case 'code': {
      return {
        type: 'github_readme',
        repo_owner: (state.repo_owner ?? '').trim() || 'octocat',
        repo_name: (state.repo_name ?? '').trim() || 'Hello-World',
        include_root: true,
      } as GithubReadmeConnector
    }
    case 'issues': {
      return {
        type: 'github_issues',
        repo_owner: (state.repo_owner ?? '').trim() || 'octocat',
        repo_name: (state.repo_name ?? '').trim() || 'Hello-World',
        state: state.github_state ?? 'all',
      } as GithubIssuesConnector
    }
    case 'chats': {
      const c: RestApiConnector = {
        type: 'rest_api',
        url: (state.rest_api_url ?? '').trim() || 'https://api.example.com/items',
        method: 'GET',
        title_field: 'title',
        content_field: 'content',
      }
      return c
    }
    default:
      return {
        type: 'sitemap',
        sitemap_url: 'https://example.com/sitemap.xml',
      }
  }
}

/** Demo mode: sample sources to create (real Ragpi payloads) */
export const DEMO_SOURCES: CreateSourcePayload[] = [
  {
    name: 'demo-docs',
    description: 'Demo docs source (S4: documentation)',
    connector: {
      type: 'sitemap',
      sitemap_url: 'https://docs.python.org/3/sitemap.xml',
    },
  },
  {
    name: 'demo-code',
    description: 'Demo code source (S4: code repos)',
    connector: {
      type: 'github_readme',
      repo_owner: 'facebook',
      repo_name: 'react',
      include_root: true,
    },
  },
  {
    name: 'demo-issues',
    description: 'Demo issues source (S4: issue tracker)',
    connector: {
      type: 'github_issues',
      repo_owner: 'tiangolo',
      repo_name: 'fastapi',
      state: 'all',
      issue_age_limit: 365,
    },
  },
  {
    name: 'demo-chats',
    description: 'Demo chats/API source (S4: chat logs / API data)',
    connector: {
      type: 'rest_api',
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      title_field: 'title',
      content_field: 'body',
      url_field: null,
    },
  },
]
