import { useEffect, useState } from 'react'
import { fetchWeather } from '../api/weather'
import { buildBody, buildTitle } from '../lib/notificationText'
import { readReminderConfig, todayKey, writeReminderConfig } from '../lib/reminderStore'
import { storage } from '../lib/storage'

const KEY = 'wb:reminder'
const TAG = 'daily-weather'
const TIME_PATTERN = /^\d{2}:\d{2}$/
const DEFAULTS = { enabled: false, time: '07:30' }

const isSupported = () => 'Notification' in window && 'serviceWorker' in navigator

const msUntil = (time) => {
    const [h, m] = time.split(':').map(Number)
    const now = new Date()
    const target = new Date(now)
    target.setHours(h, m, 0, 0)
    if (target <= now) target.setDate(target.getDate() + 1)
    return target - now
}

const getRegistration = () =>
    Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error('sw-timeout')), 3000)),
    ])

const showWeatherNotification = async (city) => {
    const registration = await getRegistration()
    const { current } = await fetchWeather(city.lat, city.lon)
    await registration.showNotification(buildTitle(city), {
        body: buildBody(current),
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: TAG,
    })
}

const registerBackgroundSync = async () => {
    try {
        const registration = await navigator.serviceWorker.ready
        if (!('periodicSync' in registration)) return false
        const status = await navigator.permissions.query({ name: 'periodic-background-sync' })
        if (status.state !== 'granted') return false
        await registration.periodicSync.register(TAG, { minInterval: 12 * 60 * 60 * 1000 })
        return true
    } catch {
        return false
    }
}

const unregisterBackgroundSync = async () => {
    try {
        const registration = await navigator.serviceWorker.ready
        await registration.periodicSync?.unregister(TAG)
    } catch { }
}

export const useReminder = (city) => {
    const supported = isSupported()
    const [permission, setPermission] = useState(() => (supported ? Notification.permission : 'unsupported'))
    const [settings, setSettings] = useState(() => ({ ...DEFAULTS, ...storage.get(KEY, {}) }))
    const [background, setBackground] = useState(false)
    const [test, setTest] = useState({ status: 'idle', message: null })
    const [tick, setTick] = useState(0)

    const validTime = TIME_PATTERN.test(settings.time)
    const active = supported && permission === 'granted' && settings.enabled && validTime && Boolean(city)

    const update = (patch) =>
        setSettings((current) => {
            const next = { ...current, ...patch }
            storage.set(KEY, next)
            return next
        })

    useEffect(() => {
        if (!supported || permission !== 'granted') return

        const sync = async () => {
            const previous = await readReminderConfig()
            await writeReminderConfig({
                enabled: active,
                time: settings.time,
                city: city ?? previous?.city ?? null,
                lastSent: previous?.lastSent ?? null,
            })
            if (active) {
                setBackground(await registerBackgroundSync())
            } else {
                await unregisterBackgroundSync()
                setBackground(false)
            }
        }
        sync()
    }, [supported, permission, active, settings.time, city])

    useEffect(() => {
        if (!active) return

        const id = setTimeout(async () => {
            const previous = await readReminderConfig()
            if (previous?.lastSent !== todayKey()) {
                try {
                    await showWeatherNotification(city)
                    await writeReminderConfig({ ...previous, lastSent: todayKey() })
                } catch { }
            }
            setTick((n) => n + 1)
        }, msUntil(settings.time))

        return () => clearTimeout(id)
    }, [active, city, settings.time, tick])

    const enable = async () => {
        if (!supported || !validTime) return
        const result = await Notification.requestPermission()
        setPermission(result)
        if (result === 'granted') update({ enabled: true })
    }

    const disable = () => update({ enabled: false })
    const setTime = (time) => update({ time })

    const sendTest = async () => {
        setTest({ status: 'sending', message: null })
        try {
            await showWeatherNotification(city)
            setTest({ status: 'sent', message: null })
        } catch (err) {
            const message =
                err.message === 'sw-timeout'
                    ? 'The service worker is not active yet. Reload the page once and try again.'
                    : err.kind
                        ? err.message
                        : 'The browser could not show the notification. Check that notifications are allowed for this site.'
            setTest({ status: 'error', message })
        }
    }

    return { supported, permission, settings, background, test, enable, disable, setTime, sendTest }
}