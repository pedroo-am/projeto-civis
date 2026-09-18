import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, MapPinned } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { signUp } from '../services/auth'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const setField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}

    if (!form.name.trim()) nextErrors.name = 'Nome obrigatório.'
    if (!form.email.trim()) nextErrors.email = 'E-mail obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Informe um e-mail válido.'
    if (!form.password) nextErrors.password = 'Senha obrigatória.'
    else if (form.password.length < 6) nextErrors.password = 'A senha deve ter pelo menos 6 caracteres.'
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirme a senha.'
    else if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'As senhas não conferem.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return

    try {
      setIsLoading(true)
      await signUp(form.name, form.email, form.password)
      navigate('/')
    } catch (error) {
      setErrors({ email: error instanceof Error ? error.message : 'Erro ao cadastrar.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e7e7e7] px-4 py-10">
      <div className="w-full max-w-[390px] overflow-hidden rounded-[28px] bg-[#0b1f2a] shadow-[0_18px_40px_rgba(11,31,42,0.22)]">
        <div className="px-8 pb-8 pt-12">
          <div className="mb-8 flex items-center justify-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
              <MapPinned size={22} className="text-[#f5f5f5]" />
            </div>
            <div>
              <div className="text-4xl font-black tracking-[-0.08em]">CIVIS</div>
              <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-300">Inteligência Cidadã</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome" value={form.name} onChange={(event) => setField('name', event.target.value)} error={errors.name} aria-label="Nome" />
            <Input label="E-mail" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} error={errors.email} aria-label="E-mail" />
            <Input label="Senha" type="password" value={form.password} onChange={(event) => setField('password', event.target.value)} error={errors.password} aria-label="Senha" />
            <Input label="Confirmar senha" type="password" value={form.confirmPassword} onChange={(event) => setField('confirmPassword', event.target.value)} error={errors.confirmPassword} aria-label="Confirmar senha" />

            {Object.keys(errors).length > 0 && !errors.email?.startsWith('Este') && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle size={16} />
                Corrija os campos destacados.
              </div>
            )}

            <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-200">
            <Link to="/login" className="underline-offset-4 hover:underline">Já tenho conta</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
