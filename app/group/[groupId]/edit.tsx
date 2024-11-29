import { UiButton } from '@/components/ui/UiButton'
import { UiTextInput } from '@/components/ui/UiTextInput'
import { colors } from '@/constants/colors'
import { usePaddings } from '@/hooks/usePaddings'
import { selectGroup } from '@/stores/filters'
import { deleteGroup, findGroupFromId, updateGroupTitle } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

export default function GroupEdit() {
  const { groupId } = useLocalSearchParams()
  const navigation = useNavigation()
  const paddings = usePaddings(true)
  const title = useRef('')

  const group = typeof groupId === 'string' ? findGroupFromId(groupId) : undefined

  const handleQueryChange = useCallback(
    (text: string) => title.current = text,
    [],
  )

  const handleOnPress = useCallback(() => {
    if (!groupId || typeof groupId !== 'string') return
    updateGroupTitle(groupId, title.current)
    navigation.goBack()
  }, [groupId, navigation])

  const handleDeleteGroup = () => {
    if (!groupId || typeof groupId !== 'string') return

    deleteGroup(groupId)
    selectGroup(undefined)

    navigation.goBack()
  }

  useEffect(
    () => {
      navigation.setOptions({
        headerRight: () => (
          <UiButton
            title={i18n.t('save')}
            onPress={handleOnPress}
          />
        ),
      })
    },
    [navigation, handleOnPress],
  )

  return (
    <View style={[styles.container, paddings]}>
      <UiTextInput
        placeholder={group?.title}
        onChangeText={handleQueryChange}
      />

      <UiButton
        title={i18n.t('deleteGroup')}
        icon="trash-outline"
        style={{ backgroundColor: colors.rose }}
        onPress={handleDeleteGroup}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
})
