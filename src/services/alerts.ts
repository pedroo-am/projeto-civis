import type { AlertItem } from '../types'
import { readStorage, writeStorage } from '../lib/storage'

const KEY = 'civis_alerts'

export const listAlerts = (userId?: string): AlertItem[] => {
  const all = readStorage<AlertItem[]>(KEY, [])
  if (!userId) {
    return all
  }
  return all.filter((item) => item.user_id === userId)
}

export const saveAlert = (alert: Omit<AlertItem, 'id' | 'created_at' | 'status'>) => {
  const all = readStorage<AlertItem[]>(KEY, [])
  const entry: AlertItem = {
    ...alert,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    status: 'pendente',
  }

  all.unshift(entry)
  writeStorage(KEY, all)
  return entry
}
