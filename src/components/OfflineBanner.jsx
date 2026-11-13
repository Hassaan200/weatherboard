import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export const OfflineBanner = () => {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div
      role="status"
      className="mb-4 flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm text-white"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      Offline mode. Showing the last city you viewed. Search and new cities need a connection.
    </div>
  )
}