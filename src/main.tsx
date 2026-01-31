import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import { applyTheme } from './lib/theme'
import { AppModeProvider } from '@/context/AppModeContext'

applyTheme()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppModeProvider>
        <App />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </AppModeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
