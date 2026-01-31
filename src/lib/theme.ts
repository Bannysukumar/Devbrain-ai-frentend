const THEME_KEY = 'devbrain_theme'

export type Theme = 'dark' | 'light'

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export function toggleTheme(): Theme {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

export function applyTheme(): void {
  document.documentElement.setAttribute('data-theme', getTheme())
}
