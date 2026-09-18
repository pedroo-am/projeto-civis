import { ChevronLeft, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/configuracoes')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Privacidade</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"><ShieldCheck size={16} /> Proteção de dados</div>
            <p className="text-sm text-slate-600">Seus dados são armazenados com controle de acesso e visibilidade restrita ao seu usuário.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Compartilhamento de localização: apenas quando necessário para SOS ou alertas.
          </div>
        </div>
      </div>
    </div>
  )
}
