import { useEffect, useMemo, useState } from 'react'
import { CloudRain, Wind, Droplets, ChevronLeft, SunMedium, Cloud } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fetchWeatherData } from '../services/weather'
import { getCurrentUser } from '../services/auth'
import { listAddresses } from '../services/addresses'
import type { Address } from '../types'
import { reverseGeocode } from '../lib/maps'

type WeatherDay = {
  date: string
  max: number
  min: number
  rain: number
}

type WeatherHour = {
  time: string
  temp: number
  rain: number
}

type WeatherState = {
  temperature: number
  humidity: number
  windSpeed: number
  precipitation: number
  condition: string
  daily: WeatherDay[]
  hourly: WeatherHour[]
}

export function WeatherPage() {
  const navigate = useNavigate()
  const [weather, setWeather] = useState<WeatherState | null>(null)
  const [error, setError] = useState('')
  const [selectedDay, setSelectedDay] = useState(0)
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; label: string } | null>(null)
  const [selectedLocationId, setSelectedLocationId] = useState<string>('current')

  const loadSavedAddresses = () => {
    const user = getCurrentUser()
    if (!user) return
    setSavedAddresses(listAddresses(user.id))
  }

  const loadWeatherForLocation = async (latitude: number, longitude: number, label: string) => {
    try {
      const result = await fetchWeatherData(latitude, longitude)
      setWeather(result)
      setError('')
      setSelectedDay(0)
      setCurrentLocation({ latitude, longitude, label })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clima.')
    }
  }

  useEffect(() => {
    const load = async () => {
      loadSavedAddresses()

      if (!navigator.geolocation) {
        await loadWeatherForLocation(-23.5505, -46.6333, 'São Paulo, SP')
        return
      }

      try {
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            const resolvedLabel = await reverseGeocode(coords.latitude, coords.longitude)
            await loadWeatherForLocation(coords.latitude, coords.longitude, resolvedLabel)
          },
          async () => {
            await loadWeatherForLocation(-23.5505, -46.6333, 'São Paulo, SP')
          },
          { enableHighAccuracy: true, timeout: 15000 },
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar clima.')
      }
    }

    void load()
  }, [])

  const handleAddressChange = async (value: string) => {
    setSelectedLocationId(value)

    if (value === 'current') {
      if (currentLocation) {
        await loadWeatherForLocation(currentLocation.latitude, currentLocation.longitude, currentLocation.label)
        return
      }

      if (!navigator.geolocation) {
        await loadWeatherForLocation(-23.5505, -46.6333, 'São Paulo, SP')
        return
      }

      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const resolvedLabel = await reverseGeocode(coords.latitude, coords.longitude)
          await loadWeatherForLocation(coords.latitude, coords.longitude, resolvedLabel)
        },
        async () => {
          await loadWeatherForLocation(-23.5505, -46.6333, 'São Paulo, SP')
        },
        { enableHighAccuracy: true, timeout: 15000 },
      )
      return
    }

    const selectedAddress = savedAddresses.find((address) => address.id === value)
    if (!selectedAddress) {
      return
    }

    await loadWeatherForLocation(selectedAddress.latitude, selectedAddress.longitude, selectedAddress.address)
  }

  const selectedForecast = useMemo(() => weather?.daily[selectedDay], [weather, selectedDay])

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold tracking-[-0.03em] text-slate-900">Histórico de clima</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-5 p-4">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : weather ? (
            <>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Endereço pesquisado</div>
                <div className="text-lg font-semibold tracking-[-0.03em] text-slate-900">{currentLocation?.label ?? 'Localização atual'}</div>
                <label className="mt-3 block text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  Escolher endereço
                </label>
                <select
                  value={selectedLocationId}
                  onChange={(event) => void handleAddressChange(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-0 transition focus:border-slate-400"
                >
                  <option value="current">Minha localização</option>
                  {savedAddresses.map((address) => (
                    <option key={address.id} value={address.id}>{address.name}</option>
                  ))}
                </select>
              </div>

              <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-slate-500">Atualmente</div>
                    <div className="mt-1 text-4xl font-bold tracking-[-0.06em] text-slate-900">{weather.temperature.toFixed(1)}°C</div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b1f2a] text-white">
                    {weather.condition === 'Chuva' ? <CloudRain size={22} /> : <SunMedium size={22} />}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-slate-500"><Droplets size={14} /> Umidade</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{weather.humidity}%</div>
                  </div>
                  <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-slate-500"><Wind size={14} /> Vento</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{weather.windSpeed} km/h</div>
                  </div>
                  <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-slate-500"><Cloud size={14} /> Chuva</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{weather.precipitation} mm</div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-[-0.03em] text-slate-900">Histórico de clima</h2>
                  <span className="text-xs uppercase tracking-[0.12em] text-slate-500">7 dias</span>
                </div>

                <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                  {weather.daily.map((item, index) => (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => setSelectedDay(index)}
                      className={`min-w-[76px] rounded-2xl border px-3 py-2 text-left transition ${
                        selectedDay === index
                          ? 'border-[#0b1f2a] bg-[#0b1f2a] text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-[0.12em] opacity-80">
                        {new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </div>
                      <div className="mt-1 text-lg font-semibold">{item.max.toFixed(0)}°</div>
                    </button>
                  ))}
                </div>

                {selectedForecast && (
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-900">
                        {new Date(selectedForecast.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                      </div>
                      <div className="text-sm text-slate-500">{selectedForecast.rain}% chuva</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Máx</div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">{selectedForecast.max.toFixed(0)}°</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Mín</div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">{selectedForecast.min.toFixed(0)}°</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 sm:col-span-1 col-span-2">
                        <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Precipitação</div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">{selectedForecast.rain}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-base font-semibold tracking-[-0.03em] text-slate-900">Próximas horas</h3>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {weather.hourly.map((item) => (
                    <div key={item.time} className="min-w-[84px] rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                      <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                        {new Date(item.time).toLocaleTimeString('pt-BR', { hour: '2-digit' })}
                      </div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">{item.temp.toFixed(0)}°</div>
                      <div className="mt-1 text-[10px] text-slate-500">{item.rain}% chuva</div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Carregando dados meteorológicos...</div>
          )}
        </div>
      </div>
    </div>
  )
}
