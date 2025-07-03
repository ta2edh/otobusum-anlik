import { Platform } from 'react-native'
import { PROVIDER_DEFAULT } from 'react-native-maps'

/**
 * iOS için harita sağlayıcısını belirle
 * Sadece Apple Maps destekleniyor
 */
export const useMapProvider = () => {
  // Sadece iOS destekleniyor, Apple Maps kullan
  if (Platform.OS === 'ios') {
    return PROVIDER_DEFAULT // Apple Maps
  }
  
  // Diğer platformlarda varsayılan
  return PROVIDER_DEFAULT
}

/**
 * Apple Maps kullanımı için bilgiler
 */
export const MAP_PROVIDER_INFO = {
  apple: {
    name: 'Apple Maps',
    description: 'iOS yerli harita uygulaması',
    pros: ['Daha iyi iOS entegrasyonu', 'Daha az pil tüketimi', 'Privacy odaklı', 'Native deneyim'],
    cons: ['Sadece iOS/macOS', 'Sınırlı özelleştirme']
  }
}
