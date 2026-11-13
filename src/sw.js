import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { buildBody, buildTitle } from './lib/notificationText'
import { readReminderConfig, todayKey, writeReminderConfig } from './lib/reminderStore'

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

registerRoute(
  ({ url }) => url.hostname === 'api.open-meteo.com',
  new NetworkFirst({
    cacheName: 'weather-api',
    networkTimeoutSeconds: 4,
    plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 })],
  })
)

const WINDOW_MINUTES = 360

const isDue = (config) => {
  if (!config?.enabled || !config.city || config.lastSent === todayKey()) return false
  const [h, m] = config.time.split(':').map(Number)
  const now = new Date()
  const minutesSince = now.getHours() * 60 + now.getMinutes() - (h * 60 + m)
  return minutesSince >= 0 && minutesSince <= WINDOW_MINUTES
}

const sendDailyReminder = async () => {
  const config = await readReminderConfig()
  if (!isDue(config)) return

  const { city } = config
  const params = new URLSearchParams({
    latitude: city.lat,
    longitude: city.lon,
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    timezone: 'auto',
    wind_speed_unit: 'kmh',
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!res.ok) return
  const { current } = await res.json()

  await self.registration.showNotification(buildTitle(city), {
    body: buildBody({
      temp: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      wind: Math.round(current.wind_speed_10m),
      code: current.weather_code,
    }),
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'daily-weather',
  })

  await writeReminderConfig({ ...config, lastSent: todayKey() })
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-weather') event.waitUntil(sendDailyReminder())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) =>
      windows.length ? windows[0].focus() : self.clients.openWindow('/')
    )
  )
})