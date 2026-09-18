import type { SOSRequest } from '../types'
import { readStorage, writeStorage } from '../lib/storage'

const KEY = 'civis_sos'

export const listSos = (userId?: string): SOSRequest[] => {
  const all = readStorage<SOSRequest[]>(KEY, [])
  if (!userId) return all
  return all.filter((item) => item.user_id === userId)
}

export const saveSOS = (userId: string, latitude: number, longitude: number) => {
  const all = readStorage<SOSRequest[]>(KEY, [])
  const entry: SOSRequest = {
    id: crypto.randomUUID(),
    user_id: userId,
    latitude,
    longitude,
    created_at: new Date().toISOString(),
    status: 'pendente',
  }

  all.unshift(entry)
  writeStorage(KEY, all)
  return entry
}
