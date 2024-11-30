import * as Location from 'expo-location'
import { Switch } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { SettingContainer } from './Container'

import { colors } from '@/constants/colors'
import { useSettings } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

export function SettingsLocation() {
  const showMyLocation = useSettings(useShallow(state => state.showMyLocation))

  const handleToggleLocation = async () => {
    let showLocation = useSettings.getState().showMyLocation
    if (!showLocation) {
      const { granted } = await Location.requestForegroundPermissionsAsync()
      if (granted) {
        showLocation = true
      }
    } else {
      showLocation = false
    }

    useSettings.setState(() => ({
      showMyLocation: showLocation,
    }))
  }

  return (
    <SettingContainer title={i18n.t('showMyLocation')}>
      <Switch
        onValueChange={handleToggleLocation}
        value={showMyLocation}
        thumbColor={colors.primary}
        trackColor={{ true: colors.primaryDarker }}
      />
    </SettingContainer>
  )
}
