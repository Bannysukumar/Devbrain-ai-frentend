import { useState } from 'react'
import type { ToolType } from '@/api/types'
import type { SourceFormState } from '@/api/sourceForm'
import { formToCreatePayload } from '@/api/sourceForm'
const TOOL_TYPES: ToolType[] = ['docs', 'code', 'issues', 'chats']

const initial: SourceFormState = {
  name: '',
  toolType: 'docs',
  description: '',
  project: '',
  sitemap_url: '',
  repo_owner: '',
  repo_name: '',
  rest_api_url: '',
  github_state: 'all',
}

interface CreateSourceModalProps {
  onClose: () => void
  onSubmit: (payload: ReturnType<typeof formToCreatePayload>) => void
  isSubmitting?: boolean
}

export function CreateSourceModal({ onClose, onSubmit, isSubmitting }: CreateSourceModalProps) {
  const [form, setForm] = useState<SourceFormState>(initial)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = formToCreatePayload(form)
    if (!payload.name || payload.name.length < 3) return
    onSubmit(payload)
  }

  const update = (patch: Partial<SourceFormState>) => setForm((f) => ({ ...f, ...patch }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-800 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Create Source</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name (unique)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. my-docs"
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              required
              minLength={3}
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tool type</label>
            <div className="flex flex-wrap gap-2">
              {TOOL_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update({ toolType: t })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                    form.toolType === t
                      ? 'bg-accent-blue text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="What this source contains"
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-accent-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Project (optional)</label>
            <input
              type="text"
              value={form.project ?? ''}
              onChange={(e) => update({ project: e.target.value })}
              placeholder="Project name"
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-accent-blue focus:border-transparent"
            />
          </div>
          {form.toolType === 'docs' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Sitemap URL</label>
              <input
                type="url"
                value={form.sitemap_url ?? ''}
                onChange={(e) => update({ sitemap_url: e.target.value })}
                placeholder="https://docs.example.com/sitemap.xml"
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
          )}
          {(form.toolType === 'code' || form.toolType === 'issues') && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Repo owner</label>
                <input
                  type="text"
                  value={form.repo_owner ?? ''}
                  onChange={(e) => update({ repo_owner: e.target.value })}
                  placeholder="e.g. facebook"
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Repo name</label>
                <input
                  type="text"
                  value={form.repo_name ?? ''}
                  onChange={(e) => update({ repo_name: e.target.value })}
                  placeholder="e.g. react"
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              {form.toolType === 'issues' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Issue state</label>
                  <select
                    value={form.github_state ?? 'all'}
                    onChange={(e) => update({ github_state: e.target.value as 'all' | 'open' | 'closed' })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100"
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              )}
            </>
          )}
          {form.toolType === 'chats' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">REST API URL</label>
              <input
                type="url"
                value={form.rest_api_url ?? ''}
                onChange={(e) => update({ rest_api_url: e.target.value })}
                placeholder="https://api.example.com/items"
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 font-medium hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !form.name.trim() || form.name.trim().length < 3}
              className="px-4 py-2 rounded-lg bg-accent-blue text-white font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating…' : 'Create Source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
