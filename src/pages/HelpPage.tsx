import { useState } from 'react'
import { ChevronLeft, Search, CircleHelp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const faqs = [
  { question: 'Como o CIVIS funciona?', answer: 'O CIVIS reúne mapas, alertas, clima e endereços para facilitar a comunicação e a segurança da sua região.' },
  { question: 'Conta e Perfil', answer: 'Você pode criar uma conta, atualizar seus dados e gerenciar preferências em perfil e configurações.' },
  { question: 'Avisos', answer: 'Você pode registrar eventos, acompanhar status e visualizar ocorrências em mapa.' },
]

export function HelpPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const filtered = faqs.filter((item) => item.question.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Ajuda</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><CircleHelp size={16} /> Como posso ajudar?</div>
            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquise aqui" className="w-full bg-transparent text-sm text-slate-700 outline-none" aria-label="Pesquisar ajuda" />
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">Nenhum tópico encontrado.</div>
            ) : (
              filtered.map((item) => (
                <details key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">{item.question}</summary>
                  <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
                </details>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
