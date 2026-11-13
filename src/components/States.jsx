import { CloudOff, MapPin } from 'lucide-react'

export const EmptyState = () => (
  <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
    <MapPin className="h-10 w-10 text-orange-600" aria-hidden="true" />
    <h2 className="mt-4 text-lg font-semibold text-stone-900">Search a city to begin</h2>
    <p className="mt-1 max-w-xs text-sm text-stone-600">
      Pick any city to see current conditions and the next 5 days.
    </p>
  </div>
)

export const WeatherSkeleton = () => (
  <div className="mt-6 animate-pulse" role="status" aria-label="Loading weather">
    <div className="h-64 rounded-3xl bg-stone-200" />
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="h-36 rounded-2xl bg-stone-200" />
      ))}
    </div>
  </div>
)

export const ErrorState = ({ message, onRetry }) => (
  <div role="alert" className="mt-6 flex flex-col items-center rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
    <CloudOff className="h-9 w-9 text-red-600" aria-hidden="true" />
    <p className="mt-3 max-w-sm text-sm text-red-800">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-4 min-h-[44px] rounded-xl bg-orange-700 px-5 text-sm font-semibold text-white hover:bg-orange-800"
    >
      Try again
    </button>
  </div>
)