import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ProtectedRoute } from '@/components/ProtectedRoute'

import { MarketingLayout } from '@/layouts/MarketingLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

import { Home } from '@/pages/marketing/Home'
import { About } from '@/pages/marketing/About'
import { Blog } from '@/pages/marketing/Blog'
import { BlogPost } from '@/pages/marketing/BlogPost'
import { Resources } from '@/pages/marketing/Resources'
import { Contact } from '@/pages/marketing/Contact'
import { Pricing } from '@/pages/marketing/Pricing'

import { Login } from '@/pages/auth/Login'
import { Signup } from '@/pages/auth/Signup'
import { ForgotPassword } from '@/pages/auth/ForgotPassword'
import { ResetPassword } from '@/pages/auth/ResetPassword'

import { Dashboard } from '@/pages/Dashboard'
import { Sources } from '@/pages/Sources'
import { SourceDetail } from '@/pages/SourceDetail'
import { Search } from '@/pages/Search'
import { Chat } from '@/pages/Chat'
import { Cards } from '@/pages/Cards'
import { Tasks } from '@/pages/Tasks'
import { TaskDetail } from '@/pages/TaskDetail'
import { Settings } from '@/pages/Settings'
import { Health } from '@/pages/Health'
import { Profile } from '@/pages/app/Profile'

import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminUsers } from '@/pages/admin/AdminUsers'
import { AdminSources } from '@/pages/admin/AdminSources'
import { AdminAuditLogs } from '@/pages/admin/AdminAuditLogs'
import { AdminSiteContent } from '@/pages/admin/AdminSiteContent'
import { AdminSettings } from '@/pages/admin/AdminSettings'

import { NotFound } from '@/pages/errors/NotFound'
import { ServerError } from '@/pages/errors/ServerError'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Marketing */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
          </Route>

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
          </Route>

          {/* App (protected) */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sources" element={<Sources />} />
            <Route path="sources/:sourceName" element={<SourceDetail />} />
            <Route path="search" element={<Search />} />
            <Route path="chat" element={<Chat />} />
            <Route path="cards" element={<Cards />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:taskId" element={<TaskDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="health" element={<Health />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="sources" element={<AdminSources />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="site-content" element={<AdminSiteContent />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Errors */}
          <Route path="/500" element={<ServerError />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
