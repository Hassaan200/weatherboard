# WeatherBoard

A personal weather dashboard built for the Edspire Frontend (React) technical challenge. Search any city, see current conditions and a 5-day forecast, pin up to five favourites, install it as a PWA, and use it offline for the last viewed city.

**Live URL:** https://weatherboard-nine.vercel.app

**Repository:** https://github.com/Hassaan200/weatherboard

## Features

- City search with live autocomplete (GeoDB Cities), 300 ms debounce, in-flight request cancellation, and visible loading, empty, no-results and error states
- Current weather (temperature, condition, icon, humidity, wind) and a 5-day forecast from Open-Meteo, with loading, error and success states for every fetch
- Client-side validation on blur and on submit, with specific messages for empty input, invalid characters, no results, rate limiting, server errors and network failure
- Up to 5 favourite cities persisted in localStorage, a quick-access panel, confirmation before removal, and graceful behaviour when storage is blocked
- Installable PWA: web manifest, 192/512 icons (plus maskable), service worker with app shell precache and network-first weather caching, offline banner, last viewed city available offline
- Daily weather reminder: user-chosen time, an explanation shown before the browser permission prompt, service worker notifications, unsupported and denied fallbacks, and a test notification button
- Responsive at 375, 768 and 1280 px with 44 px minimum touch targets

## Tech stack

React 19, Vite, Tailwind CSS v4, lucide-react, vite-plugin-pwa (injectManifest) with Workbox, plain JavaScript (ES modules). No state library and no backend.

## APIs used

| API | Purpose | Key |
|---|---|---|
| GeoDB Cities (RapidAPI) | City autocomplete | Required |
| Open-Meteo | Current weather and daily forecast | Not required |
| Notifications API, Service Worker, Periodic Background Sync | Reminder | Browser native |

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

```
VITE_RAPIDAPI_KEY=your_rapidapi_key
VITE_RAPIDAPI_HOST=wft-geo-db.p.rapidapi.com
```

```bash
npm run dev
```

The service worker is only active in a production build, so test PWA and notification features with:

```bash
npm run build && npm run preview
```

Icons are generated from `public/icon.svg` with `node scripts/make-icons.mjs`.

## Project structure

```
src/
  api/          geodb.js, weather.js (fetch and response normalisation only)
  hooks/        useDebounce, useCitySearch, useWeather, useFavourites,
                useOnlineStatus, useReminder
  components/   SearchBox, CurrentWeather, Forecast, FavouritesPanel,
                ConfirmDialog, OfflineBanner, ReminderSettings, States
  lib/          storage, weatherCodes, notificationText, reminderStore
  sw.js         service worker
```

## Architecture decisions

- **Open-Meteo as the weather source.** It needs no key, so there is no activation delay or key exposure for weather. It returns WMO weather codes instead of icons, so `weatherCodes.js` maps each code to a label and a lucide icon.
- **API modules only fetch and normalise.** Components never see provider field names. Open-Meteo's columnar `daily` arrays are converted into an array of day objects in `weather.js`.
- **Typed errors.** API modules throw an `ApiError` with a `kind` (`network`, `rate_limit`, `server`) so the UI can show a specific message for each failure.
- **Race conditions.** `useCitySearch` and `useWeather` abort the previous request in the effect cleanup, and ignore `AbortError`, so a slow earlier response cannot overwrite a newer one.
- **Status strings instead of booleans.** Search state is one of `idle | loading | success | empty | error`, which prevents impossible combinations.
- **Safe storage wrapper.** Every localStorage call is wrapped in try/catch. Favourites expose a `persisted` flag so the UI can tell users when saving is not possible.
- **Native `<dialog>`** for the removal confirmation, for built-in focus trapping and Esc handling.
- **Caching.** The app shell is precached. Open-Meteo requests use network-first with a 4 second timeout, so weather is fresh when online and available from cache when not. The last viewed city's weather is also saved in localStorage as a second layer.
- **Reminder config in the Cache API.** Service workers cannot access localStorage, so the reminder time and city are stored where both the page and the service worker can read them.

## Known limitations

- **Daily notifications are best-effort, not guaranteed.** The brief asks for a reminder that fires with the tab closed and also asks for no backend. A browser cannot guarantee a notification at an exact time without a server, because that needs a push subscription and a server-side scheduler. What is implemented instead:
  - An in-page timer fires at the chosen time while WeatherBoard is open.
  - Periodic Background Sync (Chromium, installed PWA only) lets the browser occasionally wake the service worker. The browser decides when, so the time is approximate. The service worker sends the reminder only if it is past the chosen time, within a 6 hour window, and none was sent that day.
  - A "Send test notification" button demonstrates service worker notification handling on demand.
  - The real fix is Web Push with VAPID keys and a scheduled server job, which is outside this client-only scope.
- The reminder uses the city that was viewed last.
- Offline mode covers the last viewed city only. Search and new cities need a connection.
- The GeoDB RapidAPI key is shipped in the client bundle, which is unavoidable without a backend. It is excluded from the repository and loaded from environment variables, but it is visible in the deployed app. Use a restricted free-tier key.
- GeoDB's free tier is rate limited. The app requires at least 2 characters, debounces input and cancels stale requests to stay within it.
- "Results within 300 ms of the pause" is implemented as a 300 ms debounce. Network latency means the response time itself cannot be guaranteed.
- On first visit the service worker needs one reload before it controls the page, so offline and notification features work after the second load.
- iOS Safari supports notifications only for apps added to the Home Screen, and does not support Periodic Background Sync.
- The autocomplete list supports mouse and touch selection; arrow-key navigation is not implemented.
- Optional bonuses (dark mode, unit toggle, animated icons) are not implemented.