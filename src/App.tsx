import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { SidebarNav } from './components/SidebarNav'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { LocationPage } from './pages/LocationPage'
import { WeatherPage } from './pages/WeatherPage'
import { HelpPage } from './pages/HelpPage'
import { AddressesPage } from './pages/AddressesPage'
import { AlertFormPage } from './pages/AlertFormPage'
import { AlertsPage } from './pages/AlertsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { SosPage } from './pages/SosPage'
import { RecoverPage } from './pages/RecoverPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { getCurrentUser } from './services/auth'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = getCurrentUser()
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-[#dfe3e8] px-2 py-3 lg:px-5 lg:py-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1400px] flex-col overflow-hidden rounded-[30px] border border-slate-200/80 bg-[#eef1f4] shadow-[0_24px_60px_rgba(15,23,42,0.12)] lg:min-h-[calc(100vh-2rem)] lg:flex-row">
        <SidebarNav />
        <div className="flex-1 bg-[#f4f5f6]">{children}</div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/recuperar" element={<RecoverPage />} />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/localizacao" element={<ProtectedRoute><LocationPage /></ProtectedRoute>} />
      <Route path="/clima" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
      <Route path="/ajuda" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
      <Route path="/enderecos" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
      <Route path="/avisos" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
      <Route path="/avisos/novo" element={<ProtectedRoute><AlertFormPage /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/configuracoes" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/notificacoes" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/privacidade" element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />
      <Route path="/sos" element={<ProtectedRoute><SosPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
