import Constants from 'expo-constants'
import { ScrollView, StyleSheet } from 'react-native'

import { SettingsCluster } from '@/components/settings/Cluster'
import { GroupContainer, SettingContainer } from '@/components/settings/Container'
import { SettingsLocation } from '@/components/settings/Location'
import { SettingsTheme } from '@/components/settings/Theme'
import { SettingsTraffic } from '@/components/settings/Traffic'
import { UiText } from '@/components/ui/UiText'

import { usePaddings } from '@/hooks/usePaddings'

import { i18n } from '@/translations/i18n'

export const SettingsScreen = () => {
  const paddings = usePaddings()

  return (
    <ScrollView
      style={[paddings, styles.scrollContainer]}
      contentContainerStyle={styles.scrollContainer}
    >
      <GroupContainer title={i18n.t('map')}>
        <SettingsLocation />
        <SettingsTraffic />
        <SettingsCluster />
      </GroupContainer>

      <GroupContainer title={i18n.t('theme')}>
        <SettingsTheme />
      </GroupContainer>

      <GroupContainer title={i18n.t('license')}>
        <SettingContainer
          title={i18n.t('license')}
          href="https://data.ibb.gov.tr/license"
        />
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

export default SettingsScreen
