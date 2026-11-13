const CACHE = 'wb-reminder'
const CONFIG_URL = '/__reminder-config'

export const todayKey = () => new Date().toLocaleDateString('en-CA')

export const readReminderConfig = async () => {
  try {
    const cache = await caches.open(CACHE)
    const res = await cache.match(CONFIG_URL)
    return res ? await res.json() : null
  } catch {
    return null
  }
}

export const writeReminderConfig = async (config) => {
  try {
    const cache = await caches.open(CACHE)
    await cache.put(
      CONFIG_URL,
      new Response(JSON.stringify(config), { headers: { 'Content-Type': 'application/json' } })
    )
  } catch {}
}