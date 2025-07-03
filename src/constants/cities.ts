import { Region } from 'react-native-maps'
import { Cities } from '@/types/cities'

export const cityRegions: Record<Cities, Region> = {
  istanbul: {
    latitude: 41.0082,  // İstanbul merkez
    longitude: 28.9784,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  },
  izmir: {
    latitude: 38.4192,  // İzmir merkez
    longitude: 27.1287,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  },
}

// Şehir sınırları (verilen koordinatlara göre dikdörtgen sınırlar)
export const cityBounds: Record<Cities, {
  north: number
  south: number
  east: number
  west: number
}> = {
  istanbul: {
    // Verilen koordinatlardan dikdörtgen sınırlar:
    // 41.1425808,29.9126533
    // 40.7488353,29.8307045
    // 41.0312518,28.0094102
    // 41.582636,28.1551529
    north: 41.582636,    // En kuzey nokta
    south: 40.7488353,   // En güney nokta
    east: 29.9126533,    // En doğu nokta
    west: 28.0094102,    // En batı nokta
  },
  izmir: {
    north: 38.65,   // İzmir kuzey (Foça, Menemen)
    south: 38.15,   // İzmir güney (Selçuk, Torbalı)
    east: 27.35,    // İzmir doğu (Tire, Ödemiş)
    west: 26.85,    // İzmir batı (Çeşme, Urla)
  },
}

export const getCityRegion = (city: Cities): Region => {
  return cityRegions[city]
}

// Kullanıcının konumunun belirtilen şehir içinde olup olmadığını kontrol et
export const isUserInCity = (userLatitude: number, userLongitude: number, city: Cities): boolean => {
  const bounds = cityBounds[city]
  
  const isInside = (
    userLatitude >= bounds.south &&
    userLatitude <= bounds.north &&
    userLongitude >= bounds.west &&
    userLongitude <= bounds.east
  )
  
  console.log(`🏙️ Checking if user is in ${city}:`, {
    userLat: userLatitude,
    userLng: userLongitude,
    bounds,
    isInside
  })
  
  return isInside
}

// Kullanıcının hangi şehirde olduğunu bul (eğer herhangi birinde ise)
export const getUserCity = (userLatitude: number, userLongitude: number): Cities | null => {
  if (isUserInCity(userLatitude, userLongitude, 'istanbul')) {
    return 'istanbul'
  }
  if (isUserInCity(userLatitude, userLongitude, 'izmir')) {
    return 'izmir'
  }
  return null
}
