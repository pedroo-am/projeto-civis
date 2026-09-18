import { useEffect, useState } from 'react'
import { ChevronLeft, MapPin, House, Briefcase, MapPinned, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { MapView } from '../components/MapView'
import { getCurrentUser } from '../services/auth'
import { saveAddress } from '../services/addresses'
import { geocodeAddress, reverseGeocode } from '../lib/maps'

export function LocationPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [address, setAddress] = useState('Selecionando endereço...')
  const [label, setLabel] = useState<'Casa' | 'Trabalho' | 'Outro'>('Casa')
  const [nickname, setNickname] = useState('')
  const [addressQuery, setAddressQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) {
      setAddress('Geolocalização indisponível.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const location: [number, number] = [coords.latitude, coords.longitude]
        setSelected(location)
        const resolved = await reverseGeocode(coords.latitude, coords.longitude)
        setAddress(resolved)
      },
      () => setAddress('Não foi possível obter a localização atual.'),
      { enableHighAccuracy: true },
    )
  }, [])

  const handleSearchAddress = async () => {
    const query = addressQuery.trim()
    if (!query) {
      setSearchError('Digite um endereço para pesquisar.')
      return
    }

    setIsSearching(true)
    setSearchError('')
    try {
      const result = await geocodeAddress(query)
      setSelected([result.latitude, result.longitude])
      setAddress(result.displayName)
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Não foi possível encontrar esse endereço.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSave = () => {
    const user = getCurrentUser()
    if (!selected || !user) {
      return
    }

    const finalName = (nickname.trim() || label).trim()

    saveAddress(user.id, {
      name: finalName,
      address,
      latitude: selected[0],
      longitude: selected[1],
    })
    navigate('/enderecos')
  }

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Localização</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <Input
              label="Pesquisar endereço"
              value={addressQuery}
              onChange={(event) => setAddressQuery(event.target.value)}
              placeholder="Ex: Avenida Paulista, 1000, São Paulo"
              aria-label="Pesquisar endereço"
              onKeyDown={(event) => {
                if (event.key === 'Enter') void handleSearchAddress()
              }}
            />
            <Button onClick={() => void handleSearchAddress()} disabled={isSearching} className="w-full">
              <Search size={16} />
              {isSearching ? 'Pesquisando...' : 'Pesquisar no mapa'}
            </Button>
            {searchError && <p className="text-sm text-red-600">{searchError}</p>}
          </div>

          <div className="h-[260px] overflow-hidden rounded-2xl border border-slate-200">
            {selected && (
              <MapView center={selected} marker={selected} onSelect={(lat, lng) => {
                setSelected([lat, lng])
                reverseGeocode(lat, lng).then(setAddress)
              }} height="260px" className="h-[260px]" />
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <MapPin size={16} className="text-[#d92d2d]" />
              <span>Endereço atual</span>
            </div>
            <p className="text-sm text-slate-600">{address}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Casa', icon: House },
              { name: 'Trabalho', icon: Briefcase },
              { name: 'Outro', icon: MapPinned },
            ].map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => setLabel(name as 'Casa' | 'Trabalho' | 'Outro')}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-sm font-medium ${label === name ? 'border-[#0b1f2a] bg-[#0b1f2a] text-white' : 'border-slate-200 bg-white text-slate-700'}`}
              >
                <Icon size={18} />
                {name}
              </button>
            ))}
          </div>

          <Input label="Como deseja chamar este endereço?" value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="Ex: Casa da família, trabalho, escola" aria-label="Nome do endereço" />

          <Button onClick={handleSave} className="w-full">Salvar endereço</Button>
        </div>
      </div>
    </div>
  )
}
