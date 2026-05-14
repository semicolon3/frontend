import { Navigate, Route, Routes, type ReactNode } from 'react-router-dom'
import AccountPage from './pages/AccountPage'
import ChatDiagnosisPage from './pages/ChatDiagnosisPage'
import DashboardPage from './pages/DashboardPage'
import DocumentAnalysisPage from './pages/DocumentAnalysisPage'
import LandingPage from './pages/LandingPage'
import MyDocumentsPage from './pages/MyDocumentsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { getAccessToken } from './api/client'

function PrivateRoute({ children }: { children: ReactNode }) {
  return getAccessToken() ? <>{children}</> : <Navigate to="/" replace />
}

function GuestRoute({ children }: { children: ReactNode }) {
  return getAccessToken() ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><ChatDiagnosisPage /></PrivateRoute>} />
      <Route path="/docs" element={<PrivateRoute><DocumentAnalysisPage /></PrivateRoute>} />
      <Route path="/documents" element={<PrivateRoute><MyDocumentsPage /></PrivateRoute>} />
      <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
