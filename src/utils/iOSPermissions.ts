import * as Location from 'expo-location'
import { Platform, Alert } from 'react-native'

export interface PermissionStatus {
  granted: boolean
  canAskAgain?: boolean
}

/**
 * iOS için lokasyon izni isteği
 */
export const requestLocationPermission = async (): Promise<PermissionStatus> => {
  if (Platform.OS !== 'ios') {
    return { granted: true }
  }

  try {
    const { status } = await Location.requestForegroundPermissionsAsync()
    
    if (status === 'granted') {
      return { granted: true }
    }

    if (status === 'denied') {
      Alert.alert(
        'Konum İzni Gerekli',
        'Otobüs duraklarını ve rotalarını görebilmek için konum iznine ihtiyacımız var. Lütfen ayarlardan izin verin.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Ayarlara Git', onPress: () => Location.requestForegroundPermissionsAsync() }
        ]
      )
      return { granted: false, canAskAgain: false }
    }

    return { granted: false, canAskAgain: true }
  } catch (error) {
    console.error('Location permission error:', error)
    return { granted: false, canAskAgain: false }  }
}

/**
 * Tüm gerekli izinleri kontrol et
 */
export const checkAllPermissions = async () => {
  const locationPermission = await requestLocationPermission()

  return {
    location: locationPermission,
    allGranted: locationPermission.granted
  }
}
