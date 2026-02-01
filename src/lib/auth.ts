import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

const USER_KEY = 'devbrain_user'
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? ''

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// Convert Firebase user to app User format
function firebaseUserToAppUser(firebaseUser: FirebaseUser, userData?: any): User {
  return {
    id: firebaseUser.uid,
    name: userData?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || userData?.avatar,
  }
}

// Get user from localStorage (for backward compatibility)
export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

// Set user in localStorage
export function setStoredUser(user: User | null): void {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    const userData = userDoc.data()
    
    const appUser = firebaseUserToAppUser(firebaseUser, userData)
    setStoredUser(appUser)
    return appUser
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in')
  }
}

// Sign up with email and password
export async function signUp(name: string, email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user
    
    // Store user data in Firestore
    const userData = {
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userData)
    
    const appUser = firebaseUserToAppUser(firebaseUser, userData)
    setStoredUser(appUser)
    return appUser
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up')
  }
}

// Send password reset email
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email')
  }
}

// Confirm password reset with action code
export async function confirmPasswordReset(actionCode: string, newPassword: string): Promise<void> {
  try {
    const { confirmPasswordReset } = await import('firebase/auth')
    await confirmPasswordReset(auth, actionCode, newPassword)
  } catch (error: any) {
    throw new Error(error.message || 'Failed to reset password')
  }
}

// Sign out
export async function logOut(): Promise<void> {
  try {
    await signOut(auth)
    setStoredUser(null)
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out')
  }
}

// Get current Firebase user
export function getCurrentFirebaseUser(): FirebaseUser | null {
  return auth.currentUser
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.data()
        const appUser = firebaseUserToAppUser(firebaseUser, userData)
        setStoredUser(appUser)
        callback(appUser)
      } catch (error) {
        // Fallback to basic user data if Firestore fetch fails
        const appUser = firebaseUserToAppUser(firebaseUser)
        setStoredUser(appUser)
        callback(appUser)
      }
    } else {
      setStoredUser(null)
      callback(null)
    }
  })
}

// Check if user is admin
export function isAdmin(): boolean {
  const user = getStoredUser()
  if (!user?.email || !ADMIN_EMAIL) return false
  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase().trim()
}
