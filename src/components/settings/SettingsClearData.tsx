import React, { useCallback } from 'react'
import { Alert } from 'react-native'

import { SettingsContainer } from './SettingsContainer'

import { useLinesStore } from '@/stores/lines'
import { useFiltersStore } from '@/stores/filters'
import { i18n } from '@/translations/i18n'
import { notify } from '@/utils/notify'

export const SettingsClearData = React.memo(() => {
  const clearAllLines = useLinesStore(state => state.clearAllLines)
  const clearAllGroups = useLinesStore(state => state.clearAllGroups)

  const handleClearLines = useCallback(() => {
    Alert.alert(
      i18n.t('clearAllLines'),
      i18n.t('clearAllLinesConfirm'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('clear'),
          style: 'destructive',
          onPress: () => {
            clearAllLines()
            notify(i18n.t('allLinesCleared'), 'success')
          },
        },
      ],
    )
  }, [clearAllLines])

  const handleClearGroups = useCallback(() => {
    Alert.alert(
      i18n.t('clearAllGroups'),
      i18n.t('clearAllGroupsConfirm'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('clear'),
          style: 'destructive',
          onPress: () => {
            clearAllGroups()
            notify(i18n.t('allGroupsCleared'), 'success')
          },
        },
      ],
    )
  }, [clearAllGroups])

  return (
    <>
      <SettingsContainer
        type="link"
        title={i18n.t('clearAllLines')}
        onPress={handleClearLines}
      />
      <SettingsContainer
        type="link"
        title={i18n.t('clearAllGroups')}
        onPress={handleClearGroups}
      />
    </>
  )
})
