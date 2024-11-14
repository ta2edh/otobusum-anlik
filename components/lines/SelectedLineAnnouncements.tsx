import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from '@/hooks/useTheme'
import { getAnnouncements } from '@/api/getAnnouncements'

import { UiButton } from '../ui/UiButton'
import { UiText } from '../ui/UiText'

import { memo, useRef } from 'react'
import { StyleSheet, ViewProps } from 'react-native'

interface Props extends ViewProps {
  code: string
}

export const SelectedLineAnnouncements = memo(function SelectedLineAnnouncements(props: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const { bottomSheetStyle } = useTheme()

  const announcements = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
    staleTime: 60_000 * 30,
  })

  const lineAnnouncement = announcements.data?.find(ann => ann.HATKODU === props.code)

  return (
    <>
      <UiButton
        onPress={() => bottomSheetModal.current?.present()}
        disabled={!lineAnnouncement}
        style={props.style}
        icon="megaphone-outline"
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
