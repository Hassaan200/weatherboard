import { Droplets, Wind } from 'lucide-react'
import { getCondition } from '../lib/weatherCodes'

const dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'short' })

export const CurrentWeather = ({ city, current }) => {
  const { label, icon: Icon } = getCondition(current.code, current.isDay)

  return (
    <section className="rounded-3xl bg-gradient-to-br from-orange-600 to-orange-500 p-6 text-white shadow-lg sm:p-8">
      <p className="text-lg font-semibold">{city.name}</p>
      <p className="text-sm text-orange-50">{[city.region, city.country].filter(Boolean).join(', ')}</p>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-7xl font-semibold tracking-tight">{current.temp}°</p>
          <p className="mt-1 text-lg">{label}</p>
        </div>
        <Icon className="h-20 w-20 sm:h-24 sm:w-24" strokeWidth={1.5} aria-hidden="true" />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3">
          <Droplets className="h-5 w-5" aria-hidden="true" />
          <div>
            <dt className="text-orange-50">Humidity</dt>
            <dd className="font-semibold">{current.humidity}%</dd>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3">
          <Wind className="h-5 w-5" aria-hidden="true" />
          <div>
            <dt className="text-orange-50">Wind</dt>
            <dd className="font-semibold">{current.wind} km/h</dd>
          </div>
        </div>
      </dl>
    </section>
  )
}

export const Forecast = ({ days }) => (
  <section aria-labelledby="forecast-title" className="mt-6">
    <h2 id="forecast-title" className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
      5-day forecast
    </h2>
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {days.map((day) => {
        const { label, icon: Icon } = getCondition(day.code)
        return (
          <li key={day.date} className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="font-medium text-stone-900">{dayFormatter.format(new Date(`${day.date}T00:00:00`))}</p>
            <Icon className="my-3 h-8 w-8 text-orange-600" aria-hidden="true" />
            <p className="text-sm text-stone-600">{label}</p>
            <p className="mt-1 text-sm">
              <span className="font-semibold text-stone-900">{day.max}°</span>
              <span className="text-stone-500"> / {day.min}°</span>
            </p>
          </li>
        )
      })}
    </ul>
  </section>
)