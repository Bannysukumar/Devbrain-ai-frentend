const USER_KEY = 'devbrain_user'
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? ''

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function setStoredUser(user: User | null): void {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export function isAdmin(): boolean {
  const user = getStoredUser()
  if (!user?.email || !ADMIN_EMAIL) return false
  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase().trim()
}
