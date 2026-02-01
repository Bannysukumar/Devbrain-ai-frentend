import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
// Using environment variables for security, with fallback to your provided values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBkJeAtZAlcTPOZXscy5Vy-eazuXnY0jF0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'devbrain-ai.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'devbrain-ai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'devbrain-ai.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1094959672400',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1094959672400:web:b60df5d8c2d54bc4b7b555',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-HJ7GXM4KX6',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Analytics (only in browser environment)
let analytics: ReturnType<typeof getAnalytics> | null = null
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
  } catch (error) {
    console.warn('Firebase Analytics initialization failed:', error)
  }
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export { analytics }
export default app

