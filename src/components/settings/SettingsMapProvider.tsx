import { Platform } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { SettingsContainer } from './SettingsContainer'

import { useSettingsStore } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

/**
 * iOS'ta harita sağlayıcısı seçimi
 * Apple Maps vs Google Maps
 */
export const SettingsMapProvider = () => {
  const useAppleMaps = useSettingsStore(useShallow(state => state.useAppleMaps))

  const handleToggle = () => {
    useSettingsStore.setState(state => ({
      useAppleMaps: !state.useAppleMaps
    }))
  }

  // Sadece iOS'ta göster
  if (Platform.OS !== 'ios') {
    return null
  }

  return (
    <SettingsContainer
      type="switch"
      title={i18n.t('useAppleMaps') || 'Use Apple Maps'}
      value={useAppleMaps}
      onChange={handleToggle}
    />
  )
}
