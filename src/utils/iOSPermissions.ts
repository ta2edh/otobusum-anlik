import * as Location from 'expo-location'
import { Platform, Alert, Linking } from 'react-native'
import { safeTranslate } from '@/translations/i18n'

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
        safeTranslate('permissions.location.title'),
        safeTranslate('permissions.location.message'),
        [
          { text: safeTranslate('common.cancel'), style: 'cancel' },
          { 
            text: safeTranslate('permissions.location.goToSettings'), 
            onPress: () => Linking.openURL('app-settings:') 
          }
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
