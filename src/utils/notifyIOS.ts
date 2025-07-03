import { Platform } from 'react-native'
import { notify } from './notify'

/**
 * iOS için uyarı/bildirim gösterimi
 * Artık uygulama içi toast kullanıyoruz
 */
export const notifyIOS = (title: string, body: string) => {
  if (Platform.OS !== 'ios') return

  // Uygulama içi toast göster
  notify(`${title}: ${body}`, 'info')
}

/**
 * iOS için hata bildirimi
 */
export const notifyIOSError = (message: string) => {
  if (Platform.OS !== 'ios') return
  
  notify(message, 'error')
}

/**
 * iOS için başarı bildirimi
 */
export const notifyIOSSuccess = (message: string) => {
  if (Platform.OS !== 'ios') return
  
  notify(message, 'success')
}

/**
 * Bildirim izin kontrolü - artık gereksiz
 */
export const requestNotificationPermissions = async () => {
  // Toast kullandığımız için permission gerekmez
  return true
}
