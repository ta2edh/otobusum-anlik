import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { i18n, supportedLanguages } from '@/translations/i18n'

interface LanguageStore {
  currentLanguage: string
  setLanguage: (languageCode: string) => void
  _hasHydrated: boolean
}

// Get device language or fallback to English
const getInitialLanguage = () => {
  const deviceLanguage = getLocales()[0]?.languageCode || 'en'
  // Check if device language is supported, otherwise fallback to English
  return supportedLanguages.find(lang => lang.code === deviceLanguage) ? deviceLanguage : 'en'
}

export const useLanguageStore = create(
  persist<LanguageStore>(
    (set, get) => ({
      currentLanguage: getInitialLanguage(),
      
      setLanguage: (languageCode: string) => {
        // Handle system language
        if (languageCode === 'system') {
          const systemLanguage = getInitialLanguage()
          i18n.locale = systemLanguage
          set({ currentLanguage: 'system' })
          return
        }
        
        // Güvenlik kontrolü - desteklenen dil mi?
        const isSupported = supportedLanguages.find(lang => lang.code === languageCode)
        if (!isSupported) {
          console.warn('Unsupported language code:', languageCode)
          return
        }
        
        i18n.locale = languageCode
        set({ currentLanguage: languageCode })
        
        // Production'da force reload i18n
        if (process.env.NODE_ENV === 'production') {
          setTimeout(() => {
            i18n.locale = languageCode
          }, 100)
        }
      },
      
      _hasHydrated: false,
    }),
    {
      name: 'language-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Rehydration sonrasında i18n'i güncelle
          console.log('Language store rehydrated:', state.currentLanguage)
          
          if (state.currentLanguage === 'system') {
            const systemLanguage = getInitialLanguage()
            i18n.locale = systemLanguage
            console.log('Set i18n to system language:', systemLanguage)
          } else {
            i18n.locale = state.currentLanguage
            console.log('Set i18n to stored language:', state.currentLanguage)
          }
          
          // Production'da double-check
          if (process.env.NODE_ENV === 'production') {
            setTimeout(() => {
              if (state.currentLanguage === 'system') {
                i18n.locale = getInitialLanguage()
              } else {
                i18n.locale = state.currentLanguage
              }
              console.log('Production i18n double-check:', i18n.locale)
            }, 200)
          }
          
          state._hasHydrated = true
        }
      },
    }
  )
)
