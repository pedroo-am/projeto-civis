export const DEFAULT_CENTER: [number, number] = [-23.5505, -46.6333]

export const formatAddress = (address: string | null | undefined) => {
  if (!address) return 'Endereço não informado'
  return address
}

export const geocodeAddress = async (query: string) => {
  const endpoint = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}`

  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Não foi possível localizar o endereço informado.')
  }

  const data = await response.json()
  if (!Array.isArray(data) || !data[0]) {
    throw new Error('Nenhum endereço encontrado para a busca.')
  }

  return {
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
    displayName: data[0].display_name,
  }
}

export const reverseGeocode = async (latitude: number, longitude: number) => {
  const endpoint = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`

  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Não foi possível obter o endereço atual.')
  }

  const data = await response.json()
  return data.display_name || 'Localização atual'
}
