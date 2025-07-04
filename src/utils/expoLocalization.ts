import { getLocales } from 'expo-localization'
import { I18n } from 'i18n-js'

// Expo localization utility following best practices
export class ExpoLocalization {
  private static instance: ExpoLocalization
  private i18n: I18n
  private supportedLanguages: string[]

  private constructor() {
    this.supportedLanguages = ['en', 'tr', 'ar', 'de', 'fr', 'ru', 'uk']
    this.i18n = new I18n()
    this.initialize()
  }

  public static getInstance(): ExpoLocalization {
    if (!ExpoLocalization.instance) {
      ExpoLocalization.instance = new ExpoLocalization()
    }
    return ExpoLocalization.instance
  }

  private initialize() {
    // Get device locale
    const deviceLocales = getLocales()
    const deviceLanguage = deviceLocales[0]?.languageCode || 'en'
    
    // Set up i18n
    this.i18n.enableFallback = true
    this.i18n.defaultLocale = 'en'
    
    // Set locale to device language if supported, otherwise fallback to English
    if (this.supportedLanguages.includes(deviceLanguage)) {
      this.i18n.locale = deviceLanguage
    } else {
      this.i18n.locale = 'en'
    }
  }

  public getDeviceLocales() {
    return getLocales()
  }

  public getDeviceLanguage(): string {
    return getLocales()[0]?.languageCode || 'en'
  }

  public getDeviceRegion(): string | null {
    return getLocales()[0]?.regionCode || null
  }

  public getCurrentLocale(): string {
    return this.i18n.locale
  }

  public getSupportedLanguages(): string[] {
    return this.supportedLanguages
  }

  public setLocale(locale: string) {
    if (this.supportedLanguages.includes(locale)) {
      this.i18n.locale = locale
    }
  }

  public loadTranslations(translations: Record<string, any>) {
    this.i18n.store(translations)
  }

  public translate(key: string, options?: any): string {
    try {
      const result = this.i18n.t(key, options)
      return result || key || ''
    } catch (error) {
      console.warn('Translation error for key:', key, error)
      return key || ''
    }
  }
}

// Export singleton instance
export const expoLocalization = ExpoLocalization.getInstance()

// Export convenience functions
export const getDeviceLocales = () => expoLocalization.getDeviceLocales()
export const getDeviceLanguage = () => expoLocalization.getDeviceLanguage()
export const getDeviceRegion = () => expoLocalization.getDeviceRegion()
export const getCurrentLocale = () => expoLocalization.getCurrentLocale()
export const setLocale = (locale: string) => expoLocalization.setLocale(locale)
export const translate = (key: string, options?: any) => expoLocalization.translate(key, options)
