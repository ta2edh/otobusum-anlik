import { Platform, Linking, Alert } from 'react-native'
import * as Location from 'expo-location'
import { safeTranslate } from '@/translations/i18n'

export interface MapOptions {
  latitude: number
  longitude: number
  label?: string
  address?: string
}

/**
 * iOS'ta harita uygulamasını aç (Apple Maps only)
 */
export const openMapsApp = async (options: MapOptions) => {
  if (Platform.OS !== 'ios') return

  const { latitude, longitude } = options

  try {
    // Apple Maps URL'i oluştur
    const appleMapsUrl = `maps://app?saddr=${latitude},${longitude}&daddr=${latitude},${longitude}`

    // Apple Maps'i aç
    await Linking.openURL(appleMapsUrl)
  } catch (error) {
    console.error('Maps app error:', error)
    Alert.alert(safeTranslate('navigation.error'), safeTranslate('navigation.appleMapsOpenError'))
  }
}

/**
 * iOS'ta navigasyon başlat (Apple Maps only)
 */
export const startNavigation = async (destination: MapOptions) => {
  if (Platform.OS !== 'ios') return

  try {
    // Mevcut konumu al
    const location = await Location.getCurrentPositionAsync({})
    const { latitude: currentLat, longitude: currentLng } = location.coords
    const { latitude: destLat, longitude: destLng } = destination

    // Apple Maps navigasyon URL'i
    const appleMapsNavUrl = `maps://app?saddr=${currentLat},${currentLng}&daddr=${destLat},${destLng}&dirflg=d`

    // Apple Maps'te navigasyonu başlat
    await Linking.openURL(appleMapsNavUrl)
  } catch (error) {
    console.error('Navigation error:', error)
    Alert.alert(safeTranslate('navigation.error'), safeTranslate('navigation.navigationError'))
  }
}

/**
 * App Store'da uygulama sayfasını aç
 */
export const openAppStore = () => {
  if (Platform.OS !== 'ios') return
  
  // App Store URL'i - gerçek App Store ID'si eklenecek
  const appStoreUrl = 'https://apps.apple.com/us/app/otob%C3%BCs%C3%BCm-anl%C4%B1k/id6747687530' // Placeholder
  Linking.openURL(appStoreUrl)
}

/**
 * iOS ayarlarını aç
 */
export const openSettings = () => {
  if (Platform.OS !== 'ios') return
  
  Linking.openURL('app-settings:')
}
