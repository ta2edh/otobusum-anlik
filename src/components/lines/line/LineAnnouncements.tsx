import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRef } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

import { useAnnouncements } from '@/hooks/queries/useAnnouncements'

import { UiSheetModal } from '../../ui/sheet/UiSheetModal'
import { UiButton } from '../../ui/UiButton'
import { UiText } from '../../ui/UiText'

import { i18n } from '@/translations/i18n'

interface LineAnnouncementsProps extends ViewProps {
  lineCode: string
  containerStyle?: any // Add container style prop
}

export const LineAnnouncements = ({ lineCode, containerStyle, ...props }: LineAnnouncementsProps) => {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const { query } = useAnnouncements()

  const announcements = query.data?.filter(ann => ann.HATKODU === lineCode)

  return (
    <>
      <UiButton
        onPress={() => bottomSheetModal.current?.present()}
        disabled={announcements === undefined || announcements.length === 0}
        icon="megaphone"
        variant="soft"
        containerStyle={containerStyle}
      />

      {announcements !== undefined && announcements.length > 0 && (
        <UiSheetModal
          cRef={bottomSheetModal}
          snapPoints={['50%']}
          enableDynamicSizing={false}
          list
          title={i18n.t('announcements')}
          icon="megaphone"
        >
          {announcements.map((ann, index) => (
            <View key={`${index}-${ann.GUNCELLEME_SAATI}-${ann.MESAJ.substring(0, 50)}`} style={styles.announcementContainer}>
              <UiText>{ann.GUNCELLEME_SAATI}</UiText>
              <UiText>{ann.MESAJ}</UiText>
            </View>
          ))}
        </UiSheetModal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  announcementContainer: {
    padding: 12,
    flex: 1,
  },
})
