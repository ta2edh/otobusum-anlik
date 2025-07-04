// Language store removed - iOS Settings app handles language changes
// Expo automatically detects device language changes
// No need for manual language switching in the app

export const useLanguageStore = () => {
  return {
    currentLanguage: 'system', // Always use system language
    _hasHydrated: true
  }
}
