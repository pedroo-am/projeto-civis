import { ChevronLeft, Bell, Map, Shield, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { logout } from '../services/auth'

const items = [
  { label: 'Editar perfil', path: '/perfil', icon: User },
  { label: 'Notificações', path: '/notificacoes', icon: Bell },
  { label: 'Localização', path: '/localizacao', icon: Map },
  { label: 'Privacidade', path: '/privacidade', icon: Shield },
]

export function SettingsPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Configurações</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-3 p-4">
          {items.map(({ label, path, icon: Icon }) => (
            <button key={label} type="button" onClick={() => navigate(path)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-800">
              <span className="flex items-center gap-3"><Icon size={16} /> {label}</span>
              <span>›</span>
            </button>
          ))}

          <Button variant="danger" onClick={handleLogout} className="mt-4 w-full"><LogOut size={16} /> Sair da conta</Button>
        </div>
      </div>
    </div>
  )
}
