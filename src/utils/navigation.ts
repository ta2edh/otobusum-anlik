import { Platform, Linking, Alert } from 'react-native'
import * as Location from 'expo-location'
import { safeTranslate } from '@/translations/i18n'

export interface NavigationOptions {
  latitude: number
  longitude: number
  label?: string
  address?: string
}

/**
 * Apple Maps'e yol tarifi açar
 */
export const openDirectionsInAppleMaps = async (destination: NavigationOptions) => {
  try {
    const { latitude, longitude, label, address } = destination
    
    console.log('🗺️ Opening Apple Maps directions to:', { latitude, longitude, label })
    
    // Apple Maps URL formatı
    const appleMapsUrl = `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d&t=m`
    
    // Apple Maps'in yüklü olup olmadığını kontrol et
    const canOpen = await Linking.canOpenURL(appleMapsUrl)
    
    if (canOpen) {
      await Linking.openURL(appleMapsUrl)
      console.log('✅ Apple Maps opened successfully')
      return true
    } else {
      console.error('❌ Apple Maps not available')
      Alert.alert(
        safeTranslate('navigation.error'), 
        safeTranslate('navigation.appleMapsNotAvailable')
      )
      return false
    }
  } catch (error) {
    console.error('🚨 Error opening Apple Maps:', error)
    Alert.alert(
      safeTranslate('navigation.error'), 
      safeTranslate('navigation.mapAppNotAvailable')
    )
    return false
  }
}

/**
 * Mevcut konumdan hedefe yol tarifi
 */
export const openDirectionsFromCurrentLocation = async (destination: NavigationOptions) => {
  try {
    console.log('📍 Getting current location for directions...')
    
    // Permission kontrolü
    const { status } = await Location.getForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.log('❌ No location permission for directions')
      Alert.alert(
        safeTranslate('navigation.locationPermissionRequired'), 
        safeTranslate('navigation.locationPermissionMessage')
      )
      return false
    }
    
    // Mevcut konumu al
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })
    
    const { latitude: destLat, longitude: destLng, label } = destination
    const { latitude: currentLat, longitude: currentLng } = currentLocation.coords
    
    console.log('🗺️ Opening directions from current location:', {
      from: { lat: currentLat, lng: currentLng },
      to: { lat: destLat, lng: destLng },
      label
    })
    
    // Apple Maps URL with source and destination
    const appleMapsUrl = `http://maps.apple.com/?saddr=${currentLat},${currentLng}&daddr=${destLat},${destLng}&dirflg=d&t=m`
    
    const canOpen = await Linking.canOpenURL(appleMapsUrl)
    
    if (canOpen) {
      await Linking.openURL(appleMapsUrl)
      console.log('✅ Apple Maps directions opened successfully')
      return true
    } else {
      console.error('❌ Apple Maps not available')
      Alert.alert(
        safeTranslate('navigation.error'), 
        safeTranslate('navigation.appleMapsNotAvailable')
      )
      return false
    }
  } catch (error) {
    console.error('🚨 Error opening directions:', error)
    Alert.alert(
      safeTranslate('navigation.error'), 
      safeTranslate('navigation.directionsError')
    )
    return false
  }
}

/**
 * Alternative navigation apps için seçenek göster
 */
export const showNavigationOptions = (destination: NavigationOptions) => {
  const { latitude, longitude, label = 'Hedef' } = destination
  
  Alert.alert(
    safeTranslate('navigation.directionsTitle'),
    safeTranslate('navigation.directionsMessage', { label }),
    [
      {
        text: safeTranslate('navigation.appleMaps'),
        onPress: () => openDirectionsFromCurrentLocation(destination),
      },
      {
        text: safeTranslate('navigation.cancel'),
        style: 'cancel',
      },
    ]
  )
}
