import type { UserProfile } from '../types'
import { readStorage, writeStorage } from '../lib/storage'

const USERS_KEY = 'civis_users'
const SESSION_KEY = 'civis_session'

type StoredUser = UserProfile & { password?: string }

const createDemoUser = (): UserProfile => ({
  id: 'demo-user',
  email: 'demo@civis.app',
  full_name: 'Usuário Demo',
  created_at: new Date().toISOString(),
})

const getUsers = (): StoredUser[] => {
  const users = readStorage<StoredUser[]>(USERS_KEY, [])
  if (!users.length) {
    const demo = { ...createDemoUser(), password: 'demo123' }
    writeStorage(USERS_KEY, [demo])
    return [demo]
  }
  return users
}

export const signIn = async (email: string, password: string) => {
  const users = getUsers()
  const user = users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
  )

  if (!user) {
    throw new Error('E-mail ou senha inválidos.')
  }

  const { password: _password, ...safeUser } = user
  writeStorage(SESSION_KEY, safeUser)
  return safeUser
}

export const signUp = async (fullName: string, email: string, password: string) => {
  const users = getUsers()
  const alreadyExists = users.some((user) => user.email.toLowerCase() === email.toLowerCase())

  if (alreadyExists) {
    throw new Error('Este e-mail já está em uso.')
  }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    full_name: fullName,
    email: email.toLowerCase(),
    created_at: new Date().toISOString(),
    password,
  }

  users.push(newUser)
  writeStorage(USERS_KEY, users)

  const { password: _password, ...safeUser } = newUser
  writeStorage(SESSION_KEY, safeUser)
  return safeUser
}

export const getCurrentUser = (): UserProfile | null => {
  try {
    const sessionData = readStorage<UserProfile | null>(SESSION_KEY, null)
    return sessionData
  } catch {
    return null
  }
}

export const logout = async () => {
  localStorage.removeItem(SESSION_KEY)
}

export const updateProfile = async (updates: Partial<UserProfile>) => {
  const current = getCurrentUser()
  if (!current) {
    throw new Error('Usuário não autenticado.')
  }

  const users = getUsers()
  const index = users.findIndex((user) => user.id === current.id)
  if (index === -1) {
    throw new Error('Perfil não encontrado.')
  }

  const updatedUser = { ...users[index], ...updates }
  users[index] = updatedUser
  writeStorage(USERS_KEY, users)
  writeStorage(SESSION_KEY, {
    id: updatedUser.id,
    email: updatedUser.email,
    full_name: updatedUser.full_name,
    created_at: updatedUser.created_at,
  })
  return {
    id: updatedUser.id,
    email: updatedUser.email,
    full_name: updatedUser.full_name,
    created_at: updatedUser.created_at,
  }
}
