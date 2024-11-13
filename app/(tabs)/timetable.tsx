import { LineTimetable } from '@/components/LineTimetable'
import { SelectedLines } from '@/components/SelectedLines'
import { TheFocusAwareStatusBar } from '@/components/TheFocusAwareStatusbar'
import { UiText } from '@/components/ui/UiText'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { useCallback, useState } from 'react'
import {
  LayoutChangeEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

export default function TimetableScreen() {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const [linesHeight, setLinesHeight] = useState(0)
  const keys = useLines(useShallow(state => Object.keys(state.lines)))

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setLinesHeight(event.nativeEvent.layout.height)
  }, [])

  const contentStyle: StyleProp<ViewStyle> = {
    paddingTop: linesHeight,
    gap: 8,
  }

  const timetableLineStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    paddingTop: insets.top - 4,
    zIndex: 10,
    left: 0,
    right: 0,
    backgroundColor: theme.surfaceContainerLow,
  }

  if (keys.length < 1) {
    return (
      <View style={{ flex: 1 }}>
        <TheFocusAwareStatusBar />

        <UiText info style={{ textAlign: 'center', textAlignVertical: 'center', flex: 1 }}>
          {i18n.t('timetableEmpty')}
        </UiText>
      </View>
    )
  }

  return (
    <View>
      <SelectedLines
        style={timetableLineStyle}
        onLayout={onLayout}
      />

      <ScrollView contentContainerStyle={[styles.content, contentStyle]}>
        <View style={{ flex: 1, flexDirection: 'column', gap: 8 }}>
          {keys.map(cd => (
            <LineTimetable key={cd} code={cd} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
  },
})
