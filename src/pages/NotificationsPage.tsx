import { Bell, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function NotificationsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/configuracoes')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Notificações</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3"><Bell size={16} /> Alertas de clima</div>
            <input type="checkbox" defaultChecked className="h-5 w-5" aria-label="Alertas de clima" />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3"><Bell size={16} /> Avisos na região</div>
            <input type="checkbox" defaultChecked className="h-5 w-5" aria-label="Avisos na região" />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3"><Bell size={16} /> Atualizações do SOS</div>
            <input type="checkbox" defaultChecked className="h-5 w-5" aria-label="Atualizações do SOS" />
          </div>
        </div>
      </div>
    </div>
  )
}
