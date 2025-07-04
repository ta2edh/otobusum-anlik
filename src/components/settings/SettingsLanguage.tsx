import React from 'react'
import { Platform } from 'react-native'

import { SettingsContainer } from '@/components/settings/SettingsContainer'
import { safeTranslate } from '@/translations/i18n'
import { openSettings } from '@/utils/iOSNavigation'

export const SettingsLanguage = () => {
  const handleLanguageSettings = () => {
    if (Platform.OS === 'ios') {
      openSettings()
    }
  }

  return (
    <SettingsContainer
      type="link"
      title={safeTranslate('changeLanguageInSettings')}
      onPress={handleLanguageSettings}
    />
  )
}
