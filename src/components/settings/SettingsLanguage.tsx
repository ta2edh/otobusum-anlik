import React from 'react'
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from '@/components/ui/UiText'
import { UiButton } from '@/components/ui/UiButton'

import { useTheme } from '@/hooks/useTheme'
import { useLanguageStore } from '@/stores/language'
import { i18n, supportedLanguages } from '@/translations/i18n'
import { notify } from '@/utils/notify'

export const SettingsLanguage = () => {
  const { schemeColor } = useTheme()
  const { currentLanguage, setLanguage } = useLanguageStore(
    useShallow((state) => ({
      currentLanguage: state.currentLanguage,
      setLanguage: state.setLanguage,
    }))
  )
  
  const handleLanguageChange = (languageCode: string) => {
    if (languageCode !== currentLanguage) {
      setLanguage(languageCode)
      
      // Find language name for notification
      const selectedLang = supportedLanguages.find(lang => lang.code === languageCode)
      const languageName = selectedLang?.name || selectedLang?.englishName || languageCode
      
      // Production'da force i18n update
      if (process.env.NODE_ENV === 'production') {
        setTimeout(() => {
          if (languageCode === 'system') {
            const systemLanguage = supportedLanguages.find(lang => lang.code === 'en')?.code || 'en'
            i18n.locale = systemLanguage
          } else {
            i18n.locale = languageCode
          }
        }, 50)
      }
      
      // Show success notification in new language
      setTimeout(() => {
        const changeLanguageText = i18n.t('changeLanguage') || 'Change Language'
        if (languageCode === 'system') {
          const systemDefaultText = i18n.t('systemDefault') || 'System Default'
          notify(changeLanguageText + ': ' + systemDefaultText, 'success')
        } else {
          notify(changeLanguageText + ': ' + languageName, 'success')
        }
      }, 200) // Production'da daha uzun bekleme
    }
  }
  
  const getCurrentLanguageName = () => {
    if (currentLanguage === 'system') {
      return i18n.t('systemDefault') || 'System Default'
    }
    const lang = supportedLanguages.find(lang => lang.code === currentLanguage)
    return lang?.name || lang?.englishName || currentLanguage || 'Unknown'
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: schemeColor.surfaceContainerHigh,
        },
      ]}
    >
      <UiText style={styles.title}>{i18n.t('language') || 'Language'}</UiText>
      <UiText style={[styles.subtitle, { color: schemeColor.onSurface }]}>
        {getCurrentLanguageName()}
      </UiText>
      
      <View style={styles.languageGrid}>
        {supportedLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            onPress={() => handleLanguageChange(language.code)}
            style={[
              styles.languageButton,
              {
                backgroundColor: currentLanguage === language.code
                  ? schemeColor.primary 
                  : schemeColor.surface,
                borderColor: schemeColor.onSurface,
              }
            ]}
          >
            <UiText
              style={[
                styles.languageText,
                {
                  color: currentLanguage === language.code
                    ? schemeColor.onPrimary 
                    : schemeColor.onSurface,
                }
              ]}
            >
              {language.code === 'system' ? (i18n.t('systemDefault') || 'System Default') : language.name}
            </UiText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageButton: {
    minWidth: 80,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
  },
})
