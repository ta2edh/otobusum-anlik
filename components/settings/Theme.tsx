import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useCallback, useRef } from 'react'
import { ColorSchemeName } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSheetSelect } from '../ui/sheet/UiSheetSelect'
import { UiButton } from '../ui/UiButton'

import { SettingContainer } from './Container'

import { useSettingsStore } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

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

export const SettingsTheme = () => {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const colorScheme = useSettingsStore(useShallow(state => state.colorScheme))

  const handlePress = useCallback(() => {
    bottomSheetModal.current?.present()
  }, [])

  const handleValueChange = (newScheme: ColorSchemeName) => {
    useSettingsStore.setState(() => ({
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
