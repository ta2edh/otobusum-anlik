import { UiButton } from '@/components/ui/UiButton'
import { UiTextInput } from '@/components/ui/UiTextInput'
import { usePaddings } from '@/hooks/usePaddings'
import { findGroupFromId, updateGroupTitle } from '@/stores/lines'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { View } from 'react-native'

export default function GroupEdit() {
  const { groupId } = useLocalSearchParams()
  const navigation = useNavigation()
  const paddings = usePaddings(true)
  const title = useRef('')

  const group = typeof groupId === 'string' ? findGroupFromId(groupId) : undefined
  // const placeholder = typeof groupId === 'string' ? useLines.getState().lineGroups[groupId]?.title : undefined

  const handleQueryChange = useCallback(
    (text: string) => title.current = text,
    [],
  )

  const handleOnPress = useCallback(() => {
    if (!groupId || typeof groupId !== 'string') return
    updateGroupTitle(groupId, title.current)
    navigation.goBack()
  }, [groupId, navigation])

  useEffect(
    () => {
      navigation.setOptions({
        headerRight: () => (
          <UiButton
            title="Save"
            onPress={handleOnPress}
          />
        ),
      })
    },
    [navigation, handleOnPress],
  )

  return (
    <View style={paddings}>
      <UiTextInput
        placeholder={group?.title}
        onChangeText={handleQueryChange}
      />
    </View>
  )
}
