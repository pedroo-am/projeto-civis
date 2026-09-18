import {
  AlertTriangle,
  CloudSun,
  HelpCircle,
  House,
  LogOut,
  MapPinned,
  Navigation,
  Settings,
  UserCircle2,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../services/auth'

const navItems = [
  { to: '/', label: 'Início', icon: House },
  { to: '/localizacao', label: 'Localização', icon: Navigation },
  { to: '/clima', label: 'Clima', icon: CloudSun },
  { to: '/ajuda', label: 'Ajuda', icon: HelpCircle },
  { to: '/enderecos', label: 'Endereços', icon: MapPinned },
  { to: '/avisos', label: 'Avisos', icon: AlertTriangle },
  { to: '/perfil', label: 'Perfil', icon: UserCircle2 },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
  { to: '/sos', label: 'SOS', icon: AlertTriangle },
]

export function SidebarNav() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="w-full bg-[#081d2b] p-4 text-white lg:w-[270px] lg:min-h-screen lg:p-5">
      <div className="mb-7 flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
          <MapPinned size={20} className="text-white" />
        </div>
        <div>
          <div className="text-[2.1rem] font-black leading-none tracking-[-0.08em]">CIVIS</div>
          <div className="mt-1 text-[8px] uppercase tracking-[0.2em] text-slate-300">Inteligência Cidadã</div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex min-w-max items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#d92d2d] text-white shadow-[0_12px_25px_rgba(217,45,45,0.28)]'
                  : 'text-slate-200 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
      >
        <LogOut size={16} />
        Sair
      </button>
    </aside>
  )
}
