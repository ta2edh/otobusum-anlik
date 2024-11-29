import { GroupContainer } from '@/components/settings/Container'
import { SettingsLocation } from '@/components/settings/Location'
import { UiText } from '@/components/ui/UiText'
import { usePaddings } from '@/hooks/usePaddings'

import { ScrollView, StyleSheet } from 'react-native'

import Constants from 'expo-constants'
import { i18n } from '@/translations/i18n'
import { SettingsTraffic } from '@/components/settings/Traffic'
import { SettingsTheme } from '@/components/settings/Theme'

export default function Settings() {
  const paddings = usePaddings()

  return (
    <ScrollView
      style={[paddings, styles.scrollContainer]}
      contentContainerStyle={styles.scrollContainer}
    >
      <GroupContainer title={i18n.t('map')}>
        <SettingsLocation />
        <SettingsTraffic />
      </GroupContainer>

      <GroupContainer title={i18n.t('theme')}>
        <SettingsTheme />
      </GroupContainer>

      <UiText info style={styles.version}>
        {`${i18n.t('version')} ${Constants.expoConfig?.version}`}
      </UiText>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    gap: 8,
  },
  version: {
    marginTop: 'auto',
  },
})
