import { useEffect, useMemo, useState } from 'react'
import { MapPinned, Menu, Navigation, ShieldAlert, BellRing, Map, Search, House, Crosshair } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MapView } from '../components/MapView'
import { Button } from '../components/Button'
import { BottomSheet } from '../components/BottomSheet'
import { getCurrentUser, logout } from '../services/auth'
import { DEFAULT_CENTER, reverseGeocode } from '../lib/maps'
import { saveSOS } from '../services/sos'

const menuItems = [
  { label: 'Ajuda', path: '/ajuda', icon: ShieldAlert },
  { label: 'Histórico de Clima', path: '/clima', icon: BellRing },
  { label: 'Buscar Endereço', path: '/localizacao', icon: Search },
  { label: 'Endereços Salvos', path: '/enderecos', icon: House },
  { label: 'Adicionar Aviso', path: '/avisos/novo', icon: Map },
  { label: 'Configurações', path: '/configuracoes', icon: Navigation },
]

export function HomePage() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSosOpen, setIsSosOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [address, setAddress] = useState('Carregando localização...')

  useEffect(() => {
    if (!navigator.geolocation) {
      setAddress('Geolocalização indisponível neste navegador.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const nextCenter: [number, number] = [coords.latitude, coords.longitude]
        setUserLocation(nextCenter)
        const resolvedAddress = await reverseGeocode(coords.latitude, coords.longitude)
        setAddress(resolvedAddress)
      },
      () => {
        setAddress('Não foi possível obter a localização atual.')
      },
      { enableHighAccuracy: true, timeout: 15000 },
    )
  }, [])

  const mapCenter = useMemo<[number, number]>(() => userLocation ?? DEFAULT_CENTER, [userLocation])

  const handleSosConfirm = async () => {
    const currentUser = getCurrentUser()
    if (!currentUser || !userLocation) {
      setIsSosOpen(false)
      return
    }

    const newRequest = saveSOS(currentUser.id, userLocation[0], userLocation[1])
    setIsSosOpen(false)
    navigate('/sos', { state: { request: newRequest } })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="h-screen bg-[#eef1f4] p-3 md:p-6">
      <div className="mx-auto h-[calc(100vh-1.5rem)] max-w-[420px] overflow-hidden rounded-[30px] bg-[#f5f5f5] shadow-[0_20px_50px_rgba(15,23,42,0.14)] md:max-w-[1040px] md:h-[calc(100vh-3rem)]">
        <div className="relative h-full">
          <div className="absolute inset-0">
            <MapView center={mapCenter} marker={userLocation ?? mapCenter} className="h-full" height="100%" />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-[200] flex items-center justify-between p-3">
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm">
              <MapPinned size={16} className="text-[#0b1f2a]" />
              <span className="text-xs font-medium text-slate-800">Local atual</span>
            </div>
            <button type="button" onClick={() => setIsMenuOpen(true)} className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm">
              <Menu size={16} />
              <span className="text-sm font-medium">Menu</span>
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-[200] space-y-3 bg-white/95 px-4 pb-5 pt-4 shadow-[0_-12px_28px_rgba(0,0,0,0.06)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 text-slate-800">
                <Map size={16} className="shrink-0" />
                <span className="truncate text-sm font-medium">{address}</span>
              </div>
              <button type="button" onClick={() => navigate('/localizacao')} className="shrink-0 rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-700 transition hover:bg-slate-100">
                <Crosshair size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => setIsMenuOpen(true)} className="w-full">Menu</Button>
              <Button onClick={() => setIsSosOpen(true)} className="w-full">SOS</Button>
            </div>
          </div>
        </div>
      </div>

      <BottomSheet open={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Menu">
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map(({ label, path, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                navigate(path)
              }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700"
            >
              <Icon size={18} />
              <span className="text-center">{label}</span>
            </button>
          ))}
        </div>
        <Button onClick={() => setIsSosOpen(true)} className="mt-3 w-full">SOS</Button>
        <Button variant="ghost" onClick={handleLogout} className="mt-2 w-full">Sair da conta</Button>
      </BottomSheet>

      <BottomSheet open={isSosOpen} onClose={() => setIsSosOpen(false)} title="Emergência">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Deseja realmente enviar um SOS?</p>
          <p className="text-sm text-slate-600">O SOS será enviado com sua localização atual.</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => setIsSosOpen(false)}>Cancelar</Button>
            <Button onClick={handleSosConfirm}>Enviar SOS</Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
