const BASE_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'

export class ApiError extends Error {
  constructor(kind, message) {
    super(message)
    this.kind = kind
  }
}

export const searchCities = async (query, signal) => {
  const params = new URLSearchParams({
    namePrefix: query,
    limit: '5',
    sort: '-population',
    types: 'CITY',
  })

  let res
  try {
    // console.log("KEY:", import.meta.env.VITE_RAPIDAPI_KEY?.slice(0, 8))
    res = await fetch(`${BASE_URL}?${params}`, {
      signal,
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST,
      },
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError('network', 'No internet connection. Check your network and try again.')
  }

  if (res.status === 429) {
    throw new ApiError('rate_limit', 'Too many searches. Wait a few seconds and try again.')
  }
  if (!res.ok) {
    throw new ApiError('server', 'City search is unavailable right now. Try again shortly.')
  }

  const { data } = await res.json()
  return data.map((c) => ({
    id: c.id,
    name: c.name,
    region: c.region,
    country: c.country,
    lat: c.latitude,
    lon: c.longitude,
  }))
}