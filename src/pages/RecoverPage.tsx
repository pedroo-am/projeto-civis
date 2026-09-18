import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function RecoverPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e7e7e7] px-4 py-10">
      <div className="w-full max-w-[390px] overflow-hidden rounded-[28px] bg-[#0b1f2a] shadow-[0_18px_40px_rgba(11,31,42,0.22)]">
        <div className="px-8 pb-8 pt-8">
          <div className="mb-6 flex items-center justify-between text-white">
            <Link to="/login" className="rounded-full p-2 hover:bg-white/5" aria-label="Voltar ao login">
              <ArrowLeft size={18} />
            </Link>
            <div className="text-xl font-semibold">Recuperar conta</div>
            <div className="w-8" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" aria-label="E-mail" />
            <Button type="submit" className="w-full">{sent ? 'E-mail enviado' : 'Recuperar conta'}</Button>
          </form>

          {sent && (
            <div className="mt-4 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-200">
              <div className="flex items-center gap-2"><Mail size={16} /> E-mail de recuperação enviado.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
