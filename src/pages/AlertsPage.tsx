import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { listAlerts } from '../services/alerts'
import type { AlertItem } from '../types'

export function AlertsPage() {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  useEffect(() => {
    setAlerts(listAlerts())
  }, [])

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Avisos</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-4 p-4">
          {alerts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Nenhum aviso registrado.
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">{alert.type}</span>
                  <span className="text-xs text-slate-500">{alert.status}</span>
                </div>
                <p className="text-sm text-slate-700">{alert.description}</p>
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div>Localização: {alert.address}</div>
                  <div>Data: {new Date(alert.created_at).toLocaleDateString('pt-BR')}</div>
                  <div>Horário: {new Date(alert.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
