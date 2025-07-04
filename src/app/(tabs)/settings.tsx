import Constants from 'expo-constants'
import { useEffect, useCallback, useMemo } from 'react'
import { Linking, Platform, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SettingCity } from '@/components/settings/SettingsCity'
import { SettingsCluster } from '@/components/settings/SettingsCluster'
import { SettingsGroupContainer, SettingsContainer } from '@/components/settings/SettingsContainer'
import { SettingsLanguage } from '@/components/settings/SettingsLanguage'
import { SettingsLineColors } from '@/components/settings/SettingsLineColors'
import { SettingsLocation } from '@/components/settings/SettingsLocation'
import { SettingsTheme } from '@/components/settings/SettingsTheme'
import { SettingsTraffic } from '@/components/settings/SettingsTraffic'
import { SettingsClearData } from '@/components/settings/SettingsClearData'
import { UiText } from '@/components/ui/UiText'

import { i18n } from '@/translations/i18n'
import { useIOSAppLifecycle } from '@/hooks/useIOSLifecycle'
import { useIOSStatusBar } from '@/utils/iOSTheme'
import { openAppStore, openSettings } from '@/utils/iOSNavigation'

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets()
  
  // iOS-specific hooks
  const { setAutoStatusBar } = useIOSStatusBar()
  const { isActive } = useIOSAppLifecycle()
  
  // Optimize URL opening callbacks
  const handleIstanbulLicense = useCallback(() => {
    Linking.openURL('https://data.ibb.gov.tr/license')
  }, [])
  
  const handleIzmirLicense = useCallback(() => {
    Linking.openURL('https://acikveri.bizizmir.com/tr/license')
  }, [])
  
  // Memoize static content
  const versionText = useMemo(() => {
    return `${i18n.t('version') || 'Version'} ${Constants.expoConfig?.version || '1.0.0'}`
  }, [])
  
  const contentContainerStyle = useMemo(() => [styles.scrollContainer], [])
  
  // iOS status bar'ı otomatik ayarla
  useEffect(() => {
    if (Platform.OS === 'ios') {
      setAutoStatusBar()
    }
  }, [setAutoStatusBar])

  return (
    <ScrollView
      style={{ marginTop: insets.top }}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
    >
      <SettingsGroupContainer title={i18n.t('map') || 'Map'}>
        <SettingsLocation />
        <SettingsTraffic />
        <SettingsCluster />
        <SettingsLineColors />
      </SettingsGroupContainer>

      <SettingsGroupContainer title={i18n.t('theme') || 'Theme'}>
        <SettingsTheme />
      </SettingsGroupContainer>

      <SettingsGroupContainer title={i18n.t('language') || 'Language'}>
        <SettingsLanguage />
      </SettingsGroupContainer>

      <SettingsGroupContainer title={i18n.t('data') || 'Data'}>
        <SettingsClearData />
      </SettingsGroupContainer>

      <SettingsGroupContainer title={i18n.t('other') || 'Other'}>
        <SettingCity />

        <SettingsContainer
          type="link"
          title={i18n.t('license', { city: 'istanbul' }) || 'License istanbul'}
          onPress={handleIstanbulLicense}
        />
        <SettingsContainer
          type="link"
          title={i18n.t('license', { city: 'izmir' }) || 'License izmir'}
          onPress={handleIzmirLicense}
        />
        
        {Platform.OS === 'ios' && (
          <>
            <SettingsContainer
              type="link"
              title={i18n.t('rateOnAppStore') || 'Rate on App Store'}
              onPress={openAppStore}
            />
            <SettingsContainer
              type="link"
              title={i18n.t('iOSSettings') || 'iOS Settings'}
              onPress={openSettings}
            />
          </>
        )}
      </SettingsGroupContainer>

      <UiText style={styles.version}>
        {versionText}
      </UiText>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    gap: 8,
    padding: 8,
  },
  version: {
    alignSelf: 'flex-end',
  },
})

export default SettingsScreen
