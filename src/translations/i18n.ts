import { getLocales } from 'expo-localization'
import { I18n } from 'i18n-js'

import ar from '@/translations/ar'
import de from '@/translations/de'
import en from '@/translations/en'
import fr from '@/translations/fr'
import ru from '@/translations/ru'
import tr from '@/translations/tr'
import uk from '@/translations/uk'

export const i18n = new I18n({ 
  ar, 
  de, 
  en, 
  fr, 
  ru, 
  tr, 
  uk 
})

// Get device language or fallback to English
const deviceLanguage = getLocales()[0]?.languageCode || 'en'
i18n.locale = deviceLanguage
i18n.enableFallback = true
i18n.defaultLocale = 'en'

// Güvenli çeviri fonksiyonu - undefined döndürmez
export const safeTranslate = (key: string, options?: any): string => {
  try {
    const result = i18n.t(key, options)
    return result || key || ''
  } catch (error) {
    console.warn('Translation error for key:', key, error)
    return key || ''
  }
}

export const supportedLanguages = [
  { code: 'system', name: 'System Default', englishName: 'System Default' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic' },
  { code: 'de', name: 'Deutsch', englishName: 'German' },
  { code: 'en', name: 'English', englishName: 'English' },
  { code: 'fr', name: 'Français', englishName: 'French' },
  { code: 'ru', name: 'Русский', englishName: 'Russian' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish' },
  { code: 'uk', name: 'Українська', englishName: 'Ukrainian' },
]

// Initialize language from stored setting when app starts
export const initializeLanguage = (storedLanguage?: string) => {
  if (storedLanguage && supportedLanguages.find(lang => lang.code === storedLanguage)) {
    i18n.locale = storedLanguage
  }
}
