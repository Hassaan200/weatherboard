import { useState } from 'react'
import { useCitySearch } from '../hooks/useCitySearch'

const VALID_NAME = /^[\p{L}\s.'-]+$/u

const validate = (value) => {
  const v = value.trim()
  if (!v) return 'Enter a city name to search.'
  if (!VALID_NAME.test(v)) return 'City names can only include letters, spaces, hyphens and apostrophes.'
  if (v.length < 2) return 'Type at least 2 letters to see suggestions.'
  return null
}

export const SearchBox = ({ onSelect }) => {
  const [query, setQuery] = useState('')
  const [touched, setTouched] = useState(false)
  const [open, setOpen] = useState(false)

  const validationError = validate(query)
  const { status, results, error } = useCitySearch(validationError ? '' : query)
  const fieldError = touched ? validationError : null

  const choose = (city) => {
    onSelect(city)
    setQuery(city.name)
    setOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (validationError) return
    if (results.length) choose(results[0])
    else setOpen(true)
  }

  const showPanel = open && !validationError

  return (
    <form onSubmit={handleSubmit} className="relative w-full" noValidate>
      <label htmlFor="city" className="sr-only">City</label>
      <input
        id="city"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTouched(true)
          setOpen(false)
        }}
        aria-invalid={Boolean(fieldError)}
        aria-describedby={fieldError ? 'city-error' : undefined}
        placeholder="Search a city..."
        autoComplete="off"
        className={`min-h-[44px] w-full rounded-xl border bg-white px-4 text-base outline-none focus:ring-2 ${
          fieldError ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-orange-200'
        }`}
      />

      {fieldError && (
        <p id="city-error" role="alert" className="mt-1 text-sm text-red-600">{fieldError}</p>
      )}

      {showPanel && (
        <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {status === 'loading' && <li className="px-4 py-3 text-sm text-slate-500">Searching cities...</li>}
          {status === 'error' && <li className="px-4 py-3 text-sm text-red-600">{error}</li>}
          {status === 'empty' && (
            <li className="px-4 py-3 text-sm text-slate-600">
              No cities found for "{query.trim()}". Check the spelling or try a nearby city.
            </li>
          )}
          {status === 'success' &&
            results.map((city) => (
              <li key={city.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(city)}
                  className="min-h-[44px] w-full px-4 py-2 text-left hover:bg-orange-50"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-sm text-slate-500">, {city.region}, {city.country}</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </form>
  )
}