import { useEffect, useState } from 'react'
import { searchCities } from '../api/geodb'
import { useDebounce } from './useDebounce'

const IDLE = { status: 'idle', results: [], error: null }

export const useCitySearch = (query) => {
  const debounced = useDebounce(query.trim(), 300)
  const [state, setState] = useState(IDLE)

  useEffect(() => {
    if (debounced.length < 2) {
      setState(IDLE)
      return
    }

    const controller = new AbortController()
    setState((s) => ({ ...s, status: 'loading', error: null }))

    searchCities(debounced, controller.signal)
      .then((results) =>
        setState({ status: results.length ? 'success' : 'empty', results, error: null })
      )
      .catch((err) => {
        if (err.name === 'AbortError') return
        setState({ status: 'error', results: [], error: err.message })
      })

    return () => controller.abort()
  }, [debounced])

  return state
}