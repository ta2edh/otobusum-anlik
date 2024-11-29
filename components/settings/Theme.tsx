import { useCallback, useRef } from 'react'
import { UiButton } from '../ui/UiButton'
import { SettingContainer } from './Container'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { UiSheetSelect } from '../ui/UiSheetSelect'
import { ColorSchemeName } from 'react-native'
import { i18n } from '@/translations/i18n'
import { useSettings } from '@/stores/settings'
import { useShallow } from 'zustand/react/shallow'

const options: {
  label: string
  value: ColorSchemeName
}[] = [
  {
    label: i18n.t('dark'),
    value: 'dark',
  },
  {
    label: i18n.t('light'),
    value: 'light',
  },
  {
    label: i18n.t('system'),
    value: undefined,
  },
]

export function SettingsTheme() {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const colorScheme = useSettings(useShallow(state => state.colorScheme))

  const handlePress = useCallback(() => {
    bottomSheetModal.current?.present()
  }, [])

  const handleValueChange = (newScheme: ColorSchemeName) => {
    useSettings.setState(() => ({
      colorScheme: newScheme,
    }))
  }

  return (
    <SettingContainer title={i18n.t('appTheme')}>
      <UiButton
        title={i18n.t('changeTheme')}
        onPress={handlePress}
      />

      <UiSheetSelect
        cRef={bottomSheetModal}
        title={i18n.t('appTheme')}
        value={colorScheme}
        onValueChange={handleValueChange}
        options={options}
      />
    </SettingContainer>
  )
}
