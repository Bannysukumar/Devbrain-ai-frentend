import type { ToolType } from '@/api/types'

const styles: Record<ToolType, string> = {
  docs: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  code: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  issues: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  chats: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
}

export function ToolTypeBadge({ toolType }: { toolType: ToolType }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[toolType]}`}
    >
      {toolType}
    </span>
  )
}
