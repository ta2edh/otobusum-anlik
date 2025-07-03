import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface IOSPreferences {
  app_language?: string
}

export class IOSSettingsManager {
  
  /**
   * AsyncStorage'dan dil tercihini okur
   */
  static async getLanguagePreference(): Promise<string | null> {
    try {
      const language = await AsyncStorage.getItem('app_language')
      return language || 'system'
    } catch (error) {
      console.error('Language preference read error:', error)
      return 'system'
    }
  }

  /**
   * AsyncStorage'a dil tercihini kaydeder
   */
  static async setLanguagePreference(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem('app_language', language)
      console.log('Language preference saved:', language)
    } catch (error) {
      console.error('Language preference save error:', error)
    }
  }

  /**
   * Uygulama tercihlerini temizler
   */
  static async clearPreferences(): Promise<void> {
    try {
      await AsyncStorage.removeItem('app_language')
      console.log('iOS preferences cleared')
    } catch (error) {
      console.error('Clear preferences error:', error)
    }
  }

  /**
   * Tüm tercihleri okur
   */
  static async getAllPreferences(): Promise<IOSPreferences> {
    try {
      const language = await this.getLanguagePreference()
      return {
        app_language: language || 'system'
      }
    } catch (error) {
      console.error('Get all preferences error:', error)
      return {
        app_language: 'system'
      }
    }
  }

  /**
   * Settings change listener - artık sadece placeholder
   */
  static addSettingsChangeListener(callback: (preferences: IOSPreferences) => void) {
    // AsyncStorage kullandığımız için manual listener gerekmiyor
    return () => {} // No-op cleanup function
  }

  /**
   * iOS Settings sync - artık gerekmiyor
   */
  static async syncFromIOSSettings(): Promise<void> {
    // AsyncStorage kullandığımız için senkronizasyon gerekmiyor
    console.log('Using AsyncStorage for language preferences')
  }
}
