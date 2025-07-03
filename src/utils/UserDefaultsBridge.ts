/**
 * iOS UserDefaults Manager Bridge
 * React Native ile iOS native module arasındaki köprü
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native'

interface UserDefaultsManager {
  getLanguagePreference(): Promise<string>
  setLanguagePreference(languageCode: string): Promise<boolean>
  openSettings(): Promise<boolean>
  getSystemLanguage(): Promise<string>
}

let UserDefaultsManager: UserDefaultsManager | null = null
let UserDefaultsEmitter: NativeEventEmitter | null = null

if (Platform.OS === 'ios') {
  try {
    UserDefaultsManager = NativeModules.UserDefaultsManager
    if (UserDefaultsManager) {
      UserDefaultsEmitter = new NativeEventEmitter(NativeModules.UserDefaultsManager)
    }
  } catch (error) {
    console.warn('iOS UserDefaults native module not found. Make sure to build the project with the native module.')
  }
}

export { UserDefaultsManager, UserDefaultsEmitter }
