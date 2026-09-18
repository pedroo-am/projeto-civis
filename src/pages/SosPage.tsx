import { CheckCircle2, ChevronLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export function SosPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const request = location.state?.request

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Emergência</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-5 p-6 text-center">
          <div className="flex justify-center">
            <CheckCircle2 size={52} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Seu SOS foi enviado!</h2>
            <p className="mt-2 text-sm text-slate-600">Fique calmo(a) e espere alguns minutos para a ajuda chegar.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-700">
            <div>Status: <span className="font-semibold">{request?.status ?? 'pendente'}</span></div>
            <div className="mt-2">Localização registrada: {request ? `${request.latitude.toFixed(4)}, ${request.longitude.toFixed(4)}` : 'Não disponível'}</div>
            <div className="mt-2">Horário: {request ? new Date(request.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
          </div>

          <button type="button" onClick={() => navigate('/')} className="w-full rounded-xl bg-[#d92d2d] px-4 py-3 text-sm font-semibold text-white">Voltar para o mapa</button>
        </div>
      </div>
    </div>
  )
}
