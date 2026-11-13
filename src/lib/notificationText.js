const LABELS = [
  [[0], 'clear sky'],
  [[1], 'mostly clear'],
  [[2], 'partly cloudy'],
  [[3], 'overcast'],
  [[45, 48], 'fog'],
  [[51, 53, 55, 56, 57], 'drizzle'],
  [[61, 63, 65, 66, 67, 80, 81, 82], 'rain'],
  [[71, 73, 75, 77, 85, 86], 'snow'],
  [[95, 96, 99], 'thunderstorm'],
]

const describeCode = (code) => LABELS.find(([codes]) => codes.includes(code))?.[1] ?? 'mixed conditions'

export const buildTitle = (city) => `Weather in ${city.name}`

export const buildBody = (current) =>
  `${current.temp}° and ${describeCode(current.code)}. Humidity ${current.humidity}%, wind ${current.wind} km/h.`