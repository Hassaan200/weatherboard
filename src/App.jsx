import { useState } from 'react'
import { Star } from 'lucide-react'
import { SearchBox } from './components/SearchBox'
import { CurrentWeather, Forecast } from './components/WeatherCards'
import { EmptyState, ErrorState, WeatherSkeleton } from './components/States'
import { FavouritesPanel } from './components/FavouritesPanel'
import { ConfirmDialog } from './components/ConfirmDialog'
import { CACHE_KEY, useWeather } from './hooks/useWeather'
import { MAX_FAVOURITES, useFavourites } from './hooks/useFavourites'
import { storage } from './lib/storage'
import { OfflineBanner } from './components/OfflineBanner'
import { ReminderSettings } from './components/ReminderSettings'
import { useReminder } from './hooks/useReminder'

const timeFormatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' })

const App = () => {
  const [city, setCity] = useState(() => storage.get(CACHE_KEY)?.city ?? null)
  const [pendingRemove, setPendingRemove] = useState(null)
  const [notice, setNotice] = useState(null)
  const { status, data, error, stale, savedAt, retry } = useWeather(city)
  const { favourites, persisted, add, remove, isFavourite } = useFavourites()
  const reminder = useReminder(city)

  const selectCity = (next) => {
    setNotice(null)
    setCity(next)
  }

  const toggleFavourite = () => {
    if (isFavourite(city.id)) {
      setPendingRemove(city)
      return
    }
    const result = add(city)
    if (!result.ok && result.reason === 'full') {
      setNotice(`You can save up to ${MAX_FAVOURITES} cities. Remove one to add ${city.name}.`)
    } else {
      setNotice(null)
    }
  }

  const confirmRemove = () => {
    remove(pendingRemove.id)
    setPendingRemove(null)
  }

  const active = city && isFavourite(city.id)

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <OfflineBanner />
        <h1 className="mb-5 text-2xl font-semibold tracking-tight">
          Weather<span className="text-orange-600">Board</span>
        </h1>

        <SearchBox onSelect={selectCity} />

        <FavouritesPanel
          favourites={favourites}
          activeId={city?.id}
          onSelect={selectCity}
          onRemove={setPendingRemove}
        />

        {!persisted && (
          <p role="status" className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Your browser is blocking storage, so favourites won't be saved after you close this tab.
          </p>
        )}

        {status === 'idle' && <EmptyState />}
        {status === 'loading' && <WeatherSkeleton />}
        {status === 'error' && <ErrorState message={error} onRetry={retry} />}
        {status === 'success' && (
          <div className="mt-6">
            {stale && (
              <p role="status" className="mb-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                You're offline. Showing saved weather from {timeFormatter.format(savedAt)}.
              </p>
            )}
            <div className="mb-3 flex items-center justify-end">
              <button
                type="button"
                onClick={toggleFavourite}
                aria-pressed={active}
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-medium hover:bg-orange-50"
              >
                <Star
                  className={`h-4 w-4 ${active ? 'fill-orange-500 text-orange-500' : 'text-stone-500'}`}
                  aria-hidden="true"
                />
                {active ? 'Saved' : 'Add to favourites'}
              </button>
            </div>
            {notice && (
              <p role="alert" className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {notice}
              </p>
            )}
            <CurrentWeather city={city} current={data.current} />
            <Forecast days={data.daily} />
          </div>
        )}
        <ReminderSettings reminder={reminder} hasCity={Boolean(city)} />
      </main>

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        title="Remove favourite?"
        message={`${pendingRemove?.name ?? 'This city'} will be removed from your favourites. You can add it again later.`}
        confirmLabel="Remove"
        onConfirm={confirmRemove}
        onCancel={() => setPendingRemove(null)}
      />
    </div>
  )
}

export default App