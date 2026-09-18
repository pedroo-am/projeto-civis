import type { Address } from '../types'
import { readStorage, writeStorage } from '../lib/storage'

const KEY = 'civis_addresses'

export const listAddresses = (userId: string): Address[] => {
  const all = readStorage<Address[]>(KEY, [])
  return all.filter((item) => item.user_id === userId)
}

export const saveAddress = (userId: string, address: Omit<Address, 'id' | 'user_id' | 'created_at'>) => {
  const all = readStorage<Address[]>(KEY, [])
  const entry: Address = {
    ...address,
    id: crypto.randomUUID(),
    user_id: userId,
    created_at: new Date().toISOString(),
  }

  all.push(entry)
  writeStorage(KEY, all)
  return entry
}

export const updateAddress = (userId: string, addressId: string, updates: Partial<Address>) => {
  const all = readStorage<Address[]>(KEY, [])
  const index = all.findIndex((item) => item.id === addressId && item.user_id === userId)

  if (index === -1) {
    throw new Error('Endereço não encontrado.')
  }

  all[index] = { ...all[index], ...updates }
  writeStorage(KEY, all)
  return all[index]
}

export const deleteAddress = (userId: string, addressId: string) => {
  const all = readStorage<Address[]>(KEY, [])
  const filtered = all.filter((item) => !(item.id === addressId && item.user_id === userId))
  writeStorage(KEY, filtered)
}
