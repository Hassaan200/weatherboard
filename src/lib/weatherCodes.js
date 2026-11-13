import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Moon, Sun } from 'lucide-react'

const CONDITIONS = [
  { codes: [0], label: 'Clear sky', icon: Sun },
  { codes: [1], label: 'Mostly clear', icon: CloudSun },
  { codes: [2], label: 'Partly cloudy', icon: CloudSun },
  { codes: [3], label: 'Overcast', icon: Cloud },
  { codes: [45, 48], label: 'Fog', icon: CloudFog },
  { codes: [51, 53, 55, 56, 57], label: 'Drizzle', icon: CloudDrizzle },
  { codes: [61, 63, 65, 66, 67], label: 'Rain', icon: CloudRain },
  { codes: [71, 73, 75, 77], label: 'Snow', icon: CloudSnow },
  { codes: [80, 81, 82], label: 'Rain showers', icon: CloudRain },
  { codes: [85, 86], label: 'Snow showers', icon: CloudSnow },
  { codes: [95, 96, 99], label: 'Thunderstorm', icon: CloudLightning },
]

const FALLBACK = { label: 'Unknown', icon: Cloud }

export const getCondition = (code, isDay = true) => {
  const found = CONDITIONS.find((c) => c.codes.includes(code)) ?? FALLBACK
  if (code === 0 && !isDay) return { label: 'Clear night', icon: Moon }
  return found
}