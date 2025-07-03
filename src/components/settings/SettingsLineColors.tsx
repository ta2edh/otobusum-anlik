import { Alert } from 'react-native'

import { SettingsContainer } from './SettingsContainer'

import { regenerateAllLineColors } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

export const SettingsLineColors = () => {
  const handleRegenerateColors = () => {    Alert.alert(
      i18n.t('regenerateLineColors'),
      i18n.t('regenerateLineColorsDescription') + '. Bu işlem geri alınamaz.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Yenile',
          style: 'destructive',
          onPress: () => {
            regenerateAllLineColors()
            Alert.alert(
              'Başarılı',
              'Hat renkleri başarıyla yenilendi! Değişiklikleri görmek için hatları yeniden yükleyin.',
              [{ text: 'Tamam' }]
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
