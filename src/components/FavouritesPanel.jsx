import { Star, X } from 'lucide-react'
import { MAX_FAVOURITES } from '../hooks/useFavourites'

export const FavouritesPanel = ({ favourites, activeId, onSelect, onRemove }) => (
  <section aria-labelledby="fav-title" className="mt-5">
    <h2 id="fav-title" className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
      <Star className="h-4 w-4" aria-hidden="true" />
      Favourites
      <span className="font-normal normal-case">
        {favourites.length}/{MAX_FAVOURITES}
      </span>
    </h2>

    {favourites.length === 0 ? (
      <p className="rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-3 text-sm text-stone-600">
        No favourites yet. Open a city and tap the star to pin it here.
      </p>
    ) : (
      <ul className="flex flex-wrap gap-2">
        {favourites.map((city) => (
          <li
            key={city.id}
            className={`flex items-center rounded-full border bg-white ${
              city.id === activeId ? 'border-orange-500' : 'border-stone-200'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(city)}
              className="min-h-[44px] rounded-l-full pl-4 pr-2 text-sm font-medium hover:text-orange-700"
            >
              {city.name}
            </button>
            <button
              type="button"
              onClick={() => onRemove(city)}
              aria-label={`Remove ${city.name} from favourites`}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-r-full text-stone-500 hover:text-red-600"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
)