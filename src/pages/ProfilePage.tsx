import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { getCurrentUser, updateProfile } from '../services/auth'

export function ProfilePage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [createdAt, setCreatedAt] = useState('')

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }

    setName(user.full_name)
    setEmail(user.email)
    setCreatedAt(new Date(user.created_at).toLocaleDateString('pt-BR'))
  }, [navigate])

  const handleSave = async () => {
    const user = getCurrentUser()
    if (!user) return
    await updateProfile({ full_name: name, email })
    navigate('/configuracoes')
  }

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/configuracoes')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Perfil</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-4 p-4">
          <Input label="Nome" value={name} onChange={(event) => setName(event.target.value)} aria-label="Nome" />
          <Input label="E-mail" value={email} onChange={(event) => setEmail(event.target.value)} aria-label="E-mail" />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            Data de cadastro: <span className="font-medium">{createdAt}</span>
          </div>
          <Button onClick={handleSave} className="w-full">Salvar alterações</Button>
        </div>
      </div>
    </div>
  )
}
