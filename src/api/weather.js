import { ApiError } from './geodb'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export const fetchWeather = async (lat, lon, signal) => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    forecast_days: '6',
    timezone: 'auto',
    wind_speed_unit: 'kmh',
  })

  let res
  try {
    res = await fetch(`${BASE_URL}?${params}`, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError('network', 'No internet connection. Check your network and try again.')
  }

  if (res.status === 429) {
    throw new ApiError('rate_limit', 'Weather service is busy. Wait a moment and try again.')
  }
  if (!res.ok) {
    throw new ApiError('server', 'Weather service is unavailable right now. Try again shortly.')
  }

  const d = await res.json()

  return {
    current: {
      temp: Math.round(d.current.temperature_2m),
      humidity: d.current.relative_humidity_2m,
      wind: Math.round(d.current.wind_speed_10m),
      code: d.current.weather_code,
      isDay: d.current.is_day === 1,
    },
    daily: d.daily.time
      .map((date, i) => ({
        date,
        code: d.daily.weather_code[i],
        max: Math.round(d.daily.temperature_2m_max[i]),
        min: Math.round(d.daily.temperature_2m_min[i]),
      }))
      .slice(1),
  }
}