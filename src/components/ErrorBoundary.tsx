import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
          <div className="max-w-md w-full rounded-xl bg-slate-800 border border-slate-700 p-8 text-center">
            <h1 className="text-xl font-semibold text-red-400 mb-2">Something went wrong</h1>
            <p className="text-slate-300 text-sm mb-4 break-words">
              {this.state.error.message}
            </p>
            <a
              href="/"
              className="inline-block px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
