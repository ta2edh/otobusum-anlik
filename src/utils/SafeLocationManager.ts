import * as Location from 'expo-location'
import { Platform } from 'react-native'

/**
 * Safe location tracking with error handling
 */
export class SafeLocationManager {
  private static isTracking = false
  private static watchSubscription: Location.LocationSubscription | null = null

  /**
   * Initialize the manager (called automatically)
   */
  private static initialize() {
    if (!this.hasOwnProperty('isTracking')) {
      this.isTracking = false
    }
    if (!this.hasOwnProperty('watchSubscription')) {
      this.watchSubscription = null
    }
  }
  /**
   * Request location permission safely
   */
  static async requestPermission(): Promise<boolean> {
    try {
      this.initialize()
      console.log('📍 Requesting location permission...')
      
      // First check current status
      const { status: currentStatus } = await Location.getForegroundPermissionsAsync()
      console.log('📍 Current permission status:', currentStatus)
      
      if (currentStatus === 'granted') {
        console.log('✅ Permission already granted')
        return true
      }

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync()
      console.log('📍 Permission request result:', status)
      
      const granted = status === 'granted'
      if (granted) {
        console.log('✅ Location permission granted')
      } else {
        console.log('❌ Location permission denied')
      }
      
      return granted
    } catch (error) {
      console.error('🚨 Location permission error:', error)
      return false
    }
  }
  /**
   * Get current position safely
   */
  static async getCurrentPosition(): Promise<Location.LocationObject | null> {
    try {
      this.initialize()
      const hasPermission = await this.requestPermission()
      if (!hasPermission) {
        console.log('❌ No location permission for getCurrentPosition')
        return null
      }

      console.log('📍 Getting current position...')
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 3000,
      })
      
      console.log('✅ Got current position:', {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp).toISOString()
      })
      
      return location
    } catch (error) {
      console.error('🚨 Get current position error:', error)
      
      // Try with lower accuracy as fallback
      try {
        console.log('🔄 Retrying with low accuracy...')
        const fallbackLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        })
        
        console.log('✅ Got fallback position:', {
          lat: fallbackLocation.coords.latitude,
          lng: fallbackLocation.coords.longitude,
          accuracy: fallbackLocation.coords.accuracy,
        })
        
        return fallbackLocation
      } catch (fallbackError) {
        console.error('🚨 Fallback position error:', fallbackError)
        return null
      }
    }
  }
  /**
   * Start watching location with error handling
   */
  static async startWatching(callback: (location: Location.LocationObject) => void): Promise<boolean> {
    try {
      this.initialize()
      if (this.isTracking) {
        console.log('📍 Already tracking location')
        return true
      }

      const hasPermission = await this.requestPermission()
      if (!hasPermission) return false

      console.log('📍 Starting location watch...')
      
      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          try {
            console.log('📍 Location update:', {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
              accuracy: location.coords.accuracy
            })
            callback(location)
          } catch (error) {
            console.error('🚨 Location callback error:', error)
          }
        }
      )

      this.isTracking = true
      console.log('✅ Location tracking started')
      return true
    } catch (error) {
      console.error('🚨 Start location watch error:', error)
      this.isTracking = false
      return false
    }
  }
  /**
   * Stop watching location
   */
  static stopWatching(): void {
    try {
      this.initialize()
      if (this.watchSubscription) {
        this.watchSubscription.remove()
        this.watchSubscription = null
      }
      this.isTracking = false
      console.log('🛑 Location tracking stopped')
    } catch (error) {
      console.error('🚨 Stop location watch error:', error)
    }
  }

  /**
   * Check if currently tracking
   */
  static isCurrentlyTracking(): boolean {
    this.initialize()
    return this.isTracking
  }
}

// Default export for easier imports
export default SafeLocationManager
