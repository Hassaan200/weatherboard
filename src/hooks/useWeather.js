import { useCallback, useEffect, useState } from 'react'
import { fetchWeather } from '../api/weather'
import { storage } from '../lib/storage'

export const CACHE_KEY = 'wb:last-weather'

const INITIAL = { status: 'idle', data: null, error: null, stale: false, savedAt: null }

export const useWeather = (city) => {
  const [state, setState] = useState(INITIAL)
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    if (!city) {
      setState(INITIAL)
      return
    }

    const controller = new AbortController()
    setState((s) => ({ ...s, status: 'loading', error: null }))

    fetchWeather(city.lat, city.lon, controller.signal)
      .then((data) => {
        const savedAt = Date.now()
        storage.set(CACHE_KEY, { city, data, savedAt })
        setState({ status: 'success', data, error: null, stale: false, savedAt })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        const cached = storage.get(CACHE_KEY)
        if (err.kind === 'network' && cached?.city.id === city.id) {
          setState({ status: 'success', data: cached.data, error: null, stale: true, savedAt: cached.savedAt })
          return
        }
        setState({ status: 'error', data: null, error: err.message, stale: false, savedAt: null })
      })

    return () => controller.abort()
  }, [city, attempt])

  return { ...state, retry }
}