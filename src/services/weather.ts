export const fetchWeatherData = async (latitude: number, longitude: number) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,precipitation_probability,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados climáticos.')
  }

  const data = await response.json()

  const current = data.current
  const daily = data.daily
  const hourly = data.hourly

  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    precipitation: current.precipitation,
    condition: current.precipitation > 0 ? 'Chuva' : 'Limpo',
    timezone: data.timezone || 'UTC',
    daily: daily.time.slice(0, 5).map((date: string, index: number) => ({
      date,
      max: daily.temperature_2m_max[index],
      min: daily.temperature_2m_min[index],
      rain: daily.precipitation_probability_max[index],
    })),
    hourly: hourly.time.slice(0, 6).map((time: string, index: number) => ({
      time,
      temp: hourly.temperature_2m[index],
      rain: hourly.precipitation_probability[index],
    })),
  }
}
