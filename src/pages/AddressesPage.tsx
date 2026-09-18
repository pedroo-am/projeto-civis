import { useEffect, useState } from 'react'
import { ChevronLeft, Home, Briefcase, MapPinned, Pencil, Trash2, Plus, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { getCurrentUser } from '../services/auth'
import { deleteAddress, listAddresses, updateAddress } from '../services/addresses'
import type { Address } from '../types'

export function AddressesPage() {
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState<Address[]>([])

  const refresh = () => {
    const user = getCurrentUser()
    if (!user) return
    setAddresses(listAddresses(user.id))
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleDelete = (id: string) => {
    const user = getCurrentUser()
    if (!user) return
    deleteAddress(user.id, id)
    refresh()
  }

  const handleEdit = (id: string) => {
    const user = getCurrentUser()
    if (!user) return
    const target = addresses.find((address) => address.id === id)
    if (!target) return
    const updated = updateAddress(user.id, id, { address: `${target.address} (editado)` })
    setAddresses((current) => current.map((address) => (address.id === id ? updated : address)))
  }

  const iconByName: Record<string, LucideIcon> = {
    Casa: Home,
    Trabalho: Briefcase,
    Outro: MapPinned,
  }

  return (
    <div className="min-h-screen bg-[#eff1f3] p-3 md:p-6">
      <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:max-w-[760px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <button type="button" onClick={() => navigate('/')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Voltar">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Endereços salvos</h1>
          <button type="button" onClick={() => navigate('/localizacao')} className="rounded-full bg-[#0b1f2a] p-2 text-white" aria-label="Adicionar endereço">
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-4 p-4">
          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Nenhum endereço salvo ainda.
            </div>
          ) : (
            addresses.map((address) => {
              const Icon = iconByName[address.name] ?? MapPinned
              return (
                <div key={address.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d92d2d] text-white">
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-slate-900">{address.name}</div>
                        <div className="text-sm text-slate-500">{address.address}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="secondary" className="flex-1" onClick={() => handleEdit(address.id)}>
                      <Pencil size={16} /> Editar
                    </Button>
                    <Button variant="danger" className="flex-1" onClick={() => handleDelete(address.id)}>
                      <Trash2 size={16} /> Excluir
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
