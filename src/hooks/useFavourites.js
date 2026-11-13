import { useState } from 'react'
import { storage } from '../lib/storage'

const KEY = 'wb:favourites'
export const MAX_FAVOURITES = 5

const load = () => {
  const saved = storage.get(KEY, [])
  return Array.isArray(saved) ? saved.slice(0, MAX_FAVOURITES) : []
}

export const useFavourites = () => {
  const [favourites, setFavourites] = useState(load)
  const [persisted, setPersisted] = useState(true)

  const commit = (next) => {
    setFavourites(next)
    setPersisted(storage.set(KEY, next))
  }

  const add = (city) => {
    if (favourites.some((f) => f.id === city.id)) return { ok: false, reason: 'duplicate' }
    if (favourites.length >= MAX_FAVOURITES) return { ok: false, reason: 'full' }
    commit([...favourites, city])
    return { ok: true }
  }

  const remove = (id) => commit(favourites.filter((f) => f.id !== id))
  const isFavourite = (id) => favourites.some((f) => f.id === id)

  return { favourites, persisted, add, remove, isFavourite }
}