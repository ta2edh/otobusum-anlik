import * as Location from 'expo-location'
import { useShallow } from 'zustand/react/shallow'

import { SettingsContainer } from './SettingsContainer'

import { useSettingsStore } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

export const SettingsLocation = () => {
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))

  const handleToggleLocation = async () => {
    try {
      let showLocation = useSettingsStore.getState().showMyLocation
      
      if (!showLocation) {
        console.log('📍 Settings: Requesting location permission...')
        
        // Request location permission directly
        const { status } = await Location.requestForegroundPermissionsAsync()
        
        if (status === 'granted') {
          console.log('✅ Settings: Location permission granted')
          showLocation = true
        } else {
          console.log('❌ Settings: Location permission denied')
          showLocation = false
        }
      } else {
        console.log('🚫 Settings: Disabling location')
        showLocation = false
      }

      useSettingsStore.setState(() => ({
        showMyLocation: showLocation,
      }))
      
      console.log('📍 Settings: Location setting updated:', showLocation)
    } catch (error) {
      console.error('🚨 Settings location toggle error:', error)
      
      // If error occurs, ensure location is disabled
      useSettingsStore.setState(() => ({
        showMyLocation: false,
      }))
    }
  }

  return (
    <SettingsContainer
      type="switch"
      title={i18n.t('showMyLocation') || 'Show My Location'}
      value={showMyLocation}
      onChange={handleToggleLocation}
    />
  )
}
