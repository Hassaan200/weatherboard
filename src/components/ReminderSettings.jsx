import { useState } from 'react'
import { Bell, BellOff } from 'lucide-react'

const buttonBase = 'min-h-[44px] rounded-xl px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50'

export const ReminderSettings = ({ reminder, hasCity }) => {
  const { supported, permission, settings, background, test, enable, disable, setTime, sendTest } = reminder
  const [touched, setTouched] = useState(false)
  const timeError = touched && !settings.time ? 'Pick a time for your reminder.' : null

  return (
    <section aria-labelledby="reminder-title" className="mt-8 rounded-3xl border border-stone-200 bg-white p-5">
      <h2 id="reminder-title" className="flex items-center gap-2 text-base font-semibold">
        <Bell className="h-5 w-5 text-orange-600" aria-hidden="true" />
        Daily weather reminder
      </h2>

      {!supported && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-700">
          <BellOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          This browser doesn't support notifications, so reminders are unavailable. On iPhone, add WeatherBoard to
          your Home Screen first. Everything else in the app works as usual.
        </p>
      )}

      {supported && permission === 'denied' && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <BellOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Notifications are blocked for this site. To get reminders, allow notifications in your browser's site
          settings and reload. The rest of WeatherBoard is not affected.
        </p>
      )}

      {supported && permission === 'default' && (
        <div className="mt-3">
          <p className="text-sm text-stone-600">
            WeatherBoard can send you a short weather summary each morning. To do that it needs permission to show
            notifications. Nothing is sent to us: your reminder time and city stay on this device.
          </p>
          <div className="mt-4">
            <label htmlFor="reminder-time-first" className="block text-sm font-medium text-stone-700">
              Reminder time
            </label>
            <input
              id="reminder-time-first"
              type="time"
              value={settings.time}
              onChange={(e) => setTime(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={Boolean(timeError)}
              className="mt-1 min-h-[44px] rounded-xl border border-stone-300 px-3"
            />
            {timeError && <p role="alert" className="mt-1 text-sm text-red-600">{timeError}</p>}
          </div>
          <button
            type="button"
            onClick={enable}
            disabled={!settings.time}
            className={`${buttonBase} mt-4 bg-orange-700 text-white hover:bg-orange-800`}
          >
            Allow notifications and turn on
          </button>
        </div>
      )}

      {supported && permission === 'granted' && (
        <div className="mt-3">
          <label htmlFor="reminder-time" className="block text-sm font-medium text-stone-700">
            Reminder time
          </label>
          <input
            id="reminder-time"
            type="time"
            value={settings.time}
            onChange={(e) => setTime(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={Boolean(timeError)}
            aria-describedby={timeError ? 'reminder-time-error' : undefined}
            className="mt-1 min-h-[44px] rounded-xl border border-stone-300 px-3"
          />
          {timeError && (
            <p id="reminder-time-error" role="alert" className="mt-1 text-sm text-red-600">{timeError}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={settings.enabled ? disable : enable}
              disabled={!settings.enabled && !settings.time}
              className={`${buttonBase} ${
                settings.enabled
                  ? 'border border-stone-300 hover:bg-stone-50'
                  : 'bg-orange-700 text-white hover:bg-orange-800'
              }`}
            >
              {settings.enabled ? 'Turn off reminder' : 'Turn on reminder'}
            </button>
            <button
              type="button"
              onClick={sendTest}
              disabled={!hasCity || test.status === 'sending'}
              className={`${buttonBase} border border-stone-300 hover:bg-stone-50`}
            >
              {test.status === 'sending' ? 'Sending...' : 'Send test notification'}
            </button>
          </div>

          {!hasCity && (
            <p className="mt-3 text-sm text-stone-600">Search for a city first. The reminder uses the city you last viewed.</p>
          )}
          {test.status === 'sent' && (
            <p role="status" className="mt-3 text-sm text-green-700">Test notification sent. Check your notifications.</p>
          )}
          {test.status === 'error' && <p role="alert" className="mt-3 text-sm text-red-700">{test.message}</p>}

          {settings.enabled && (
            <p className="mt-3 text-sm text-stone-600">
              {background
                ? 'Background delivery is on. Your browser decides exactly when it runs, so the time is approximate.'
                : 'Background delivery isn\'t available here, so the reminder is sent only while WeatherBoard is open.'}
            </p>
          )}
        </div>
      )}

      <p className="mt-4 border-t border-stone-100 pt-3 text-xs text-stone-500">
        Reminders are best-effort. Without a server, no browser can guarantee a notification at an exact time when
        the app is closed.
      </p>
    </section>
  )
}