import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, MapPinned } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { signIn } from '../services/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('demo@civis.app')
  const [password, setPassword] = useState('demo123')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha para continuar.')
      return
    }

    try {
      setIsLoading(true)
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.')
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
            <Input
              aria-label="E-mail"
              label="E-mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
            />
            <Input
              aria-label="Senha"
              label="Senha"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
              autoComplete="current-password"
            />

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-sm">
            <Link to="/cadastro" className="text-slate-200 underline-offset-4 hover:underline">
              Cadastrar Usuário
            </Link>
            <Link to="/recuperar" className="text-slate-200 underline-offset-4 hover:underline">
              Recuperar Conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
