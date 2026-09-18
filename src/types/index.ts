export type UserProfile = {
  id: string
  email: string
  full_name: string
  created_at: string
}

export type Address = {
  id: string
  user_id: string
  name: string
  address: string
  latitude: number
  longitude: number
  created_at: string
}

export type AlertItem = {
  id: string
  user_id: string
  address: string
  type: string
  description: string
  latitude: number
  longitude: number
  created_at: string
  status: 'pendente' | 'em análise' | 'resolvido'
}

export type SOSRequest = {
  id: string
  user_id: string
  latitude: number
  longitude: number
  created_at: string
  status: 'pendente' | 'em atendimento' | 'resolvido'
}

export type WeatherResponse = {
  temperature: number
  humidity: number
  windSpeed: number
  precipitation: number
  condition: string
  timezone: string
}
