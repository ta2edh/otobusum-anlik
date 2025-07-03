/**
 * Production için debug utility
 * Development ortamında console.log çalışır, production'da sessiz kalır
 */

export const debugLog = (...args: any[]) => {
  if (__DEV__) {
    console.log(...args)
  }
}

export const debugWarn = (...args: any[]) => {
  if (__DEV__) {
    console.warn(...args)
  }
}

export const debugError = (...args: any[]) => {
  // Error'lar her zaman görünür olmalı
  console.error(...args)
}
