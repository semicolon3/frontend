import { Navigate, Route, Routes } from 'react-router-dom'
import ChatDiagnosisPage from './pages/ChatDiagnosisPage'
import DashboardPage from './pages/DashboardPage'
import DocumentAnalysisPage from './pages/DocumentAnalysisPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/chat" element={<ChatDiagnosisPage />} />
      <Route path="/docs" element={<DocumentAnalysisPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
