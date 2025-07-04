import { Alert } from 'react-native'

import { SettingsContainer } from './SettingsContainer'

import { regenerateAllLineColors } from '@/stores/lines'
import { i18n, safeTranslate } from '@/translations/i18n'

export const SettingsLineColors = () => {
  const handleRegenerateColors = () => {    
    Alert.alert(
      i18n.t('regenerateLineColors'),
      i18n.t('regenerateLineColorsDescription') + '. ' + i18n.t('regenerateLineColorsWarning'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('regenerate'),
          style: 'destructive',
          onPress: () => {
            regenerateAllLineColors()
            Alert.alert(
              i18n.t('regenerateLineColorsSuccess'),
              i18n.t('regenerateLineColorsSuccessMessage'),
              [{ text: i18n.t('common.ok') }]
            )
          },
        },
      ]
    )
  }
  return (
    <SettingsContainer
      type="link"
      title={i18n.t('regenerateLineColors')}
      onPress={handleRegenerateColors}
    />
  )
}
