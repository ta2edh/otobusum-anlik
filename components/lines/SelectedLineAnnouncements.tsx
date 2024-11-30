import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { memo, useMemo, useRef } from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewProps } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useAnnouncements } from '@/hooks/useAnnouncements'
import { useTheme } from '@/hooks/useTheme'

import { UiSheetModal } from '../ui/sheet/UiSheetModal'
import { UiButton } from '../ui/UiButton'
import { UiText } from '../ui/UiText'

import { useLines } from '@/stores/lines'

interface Props extends ViewProps {
  code: string
}

export const SelectedLineAnnouncements = memo(function SelectedLineAnnouncements(props: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))
  const { query } = useAnnouncements()
  const { getSchemeColorHex } = useTheme(lineTheme)

  const announcements = query.data?.filter(ann => ann.HATKODU === props.code)

  const textContainerStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      color: getSchemeColorHex('onSecondaryContainer'),
    }),
    [getSchemeColorHex],
  )

  return (
    <>
      <UiButton
        onPress={() => bottomSheetModal.current?.present()}
        disabled={announcements === undefined || announcements.length === 0}
        style={props.style}
        icon="megaphone-outline"
        textStyle={textContainerStyle}
      />

      {announcements !== undefined && announcements.length > 0 && (
        <UiSheetModal
          ref={bottomSheetModal}
          snapPoints={['50%']}
          enableDynamicSizing={false}
        >
          <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
            {announcements.map(ann => (
              <View key={`${ann.GUNCELLEME_SAATI}-${ann.MESAJ}`} style={styles.announcementContainer}>
                <UiText>{ann.GUNCELLEME_SAATI}</UiText>
                <UiText>{ann.MESAJ}</UiText>
              </View>
            ))}
          </BottomSheetScrollView>
        </UiSheetModal>
      )}
    </>
  )
})

const styles = StyleSheet.create({
  contentContainer: {
    padding: 8,
  },
  announcementContainer: {
    padding: 8,
    flex: 1,
  },
})
