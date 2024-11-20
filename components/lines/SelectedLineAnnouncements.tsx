import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { useTheme } from '@/hooks/useTheme'

import { UiButton } from '../ui/UiButton'
import { UiText } from '../ui/UiText'

import { memo, useMemo, useRef } from 'react'
import { StyleProp, StyleSheet, TextStyle, ViewProps } from 'react-native'
import { useLines } from '@/stores/lines'
import { useShallow } from 'zustand/react/shallow'

interface Props extends ViewProps {
  code: string
}

export const SelectedLineAnnouncements = memo(function SelectedLineAnnouncements(props: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))
  const { query } = useAnnouncements()
  const { getSchemeColorHex, bottomSheetStyle } = useTheme(lineTheme)

  const lineAnnouncement = query.data?.find(ann => ann.HATKODU === props.code)

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
        disabled={!lineAnnouncement}
        style={props.style}
        icon="megaphone-outline"
        textStyle={textContainerStyle}
      />

      {!!lineAnnouncement && (
        <BottomSheetModal
          ref={bottomSheetModal}
          snapPoints={['50%']}
          enableDynamicSizing={false}
          {...bottomSheetStyle}
        >
          <BottomSheetView style={styles.announcementsContainer}>
            <UiText>{lineAnnouncement.GUNCELLEME_SAATI}</UiText>
            <UiText>{lineAnnouncement.MESAJ}</UiText>
          </BottomSheetView>
        </BottomSheetModal>
      )}
    </>
  )
})

const styles = StyleSheet.create({
  announcementsContainer: {
    padding: 8,
    flex: 1,
  },
})
