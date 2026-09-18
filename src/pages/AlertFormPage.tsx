import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { getCurrentUser } from '../services/auth'
import { saveAlert } from '../services/alerts'

const categories = ['Alagamento', 'Acidente', 'Incêndio', 'Obstrução de via', 'Deslizamento', 'Falta de energia', 'Outro']

export function AlertFormPage() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [type, setType] = useState('Alagamento')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const user = getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      saveAlert({
        user_id: user.id,
        address: address || 'Localização atual',
        type,
        description,
        latitude: -23.5505,
        longitude: -46.6333,
      })
      navigate('/avisos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Adicionar aviso</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-4 p-4">
          <Input label="Endereço" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Rua, bairro, cidade" aria-label="Endereço" />

          <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Tipo de aviso</span>
            <select value={type} onChange={(event) => setType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none">
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Descrição</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={6} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none" placeholder="Descreva a ocorrência" />
          </label>

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>{loading ? 'Salvando...' : 'Salvar aviso'}</Button>
        </div>
      </div>
    </div>
  )
}
