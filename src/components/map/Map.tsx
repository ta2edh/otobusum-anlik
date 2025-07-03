import { RefObject, useImperativeHandle, useRef, useEffect, useState } from 'react'
import { Dimensions, TouchableOpacity, StyleSheet, Text } from 'react-native'
import MapView, { LatLng, Region } from 'react-native-maps'
import Animated, { clamp, Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'

import { useSheetModal } from '@/hooks/contexts/useSheetModal'
import { useTheme } from '@/hooks/useTheme'

import { getMapStyle } from '@/constants/mapStyles'
import { useSettingsStore } from '@/stores/settings'
import { collapseAllLines } from '@/stores/misc'

import { useMapProvider } from './MapProvider'

export interface TheMapProps {
  children?: React.ReactNode
  onMapReady?: () => void
  onMapRegionUpdate?: (region: Region) => void
  initialRegion?: Region
  ref?: RefObject<TheMapRef | null>
}

export interface TheMapRef {
  animateCamera: (region: Region) => void
  moveTo: (latlng: LatLng) => void
  fitInsideCoordinates: (coordinates: LatLng[]) => void
  centerOnUserLocation: () => void // Simplified - no region param needed
  animateToUserLocation: () => void // New iOS-specific method
}

const screen = Dimensions.get('screen')

export const TheMap = ({ ref, onMapReady, onMapRegionUpdate, initialRegion, ...props }: TheMapProps) => {
  const map = useRef<MapView>(null)
  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  const storedColorScheme = useSettingsStore(useShallow(state => state.colorScheme))
  const mapProvider = useMapProvider()

  // State to track location permission and current location
  const [hasLocationPermission, setHasLocationPermission] = useState(false)
  const [currentUserLocation, setCurrentUserLocation] = useState<LatLng | null>(null)

  // Use theme hook for complete theme logic
  const { colorScheme: hookColorScheme } = useTheme()
  
  // For map, use stored color scheme if explicitly set, otherwise use hook's resolved scheme
  // This ensures that when user sets app theme to light/dark, map follows it regardless of device theme
  const mapColorScheme = storedColorScheme !== undefined ? storedColorScheme : hookColorScheme
  
  const insets = useSafeAreaInsets()
  const sheetContext = useSheetModal()

  // Debug logging
  useEffect(() => {
    console.log('🎨 Map theme debug:', {
      storedColorScheme,
      hookColorScheme,
      mapColorScheme,
    })
  }, [storedColorScheme, hookColorScheme, mapColorScheme])

  // Request location permission and get current location
  useEffect(() => {
    const requestLocationAndTrack = async () => {
      if (showMyLocation) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync()
          setHasLocationPermission(status === 'granted')
          
          if (status === 'granted') {
            console.log('✅ Location permission granted - Apple Maps will handle location display')
            
            // Get current location for the center button
            try {
              const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
              })
              setCurrentUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              })
              console.log('📍 Current user location set:', {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              })
            } catch (locationError) {
              console.error('🚨 Failed to get current location:', locationError)
            }
          } else {
            console.log('❌ Location permission denied')
            setCurrentUserLocation(null)
          }
        } catch (error) {
          console.error('🚨 Location permission error:', error)
          setHasLocationPermission(false)
          setCurrentUserLocation(null)
        }
      } else {
        setHasLocationPermission(false)
        setCurrentUserLocation(null)
      }
    }

    requestLocationAndTrack()
  }, [showMyLocation])

  useImperativeHandle(ref, () => {
    return {
      animateCamera: (region) => {
        // Otobüs/durak konumları için minimal offset
        let re = { ...region }
        re.latitude -= 0.002 // Reduced offset for better centering

        map.current?.animateToRegion(re)
      },
      moveTo: (latlng) => {
        map.current?.animateCamera({
          center: latlng,
        })
      },
      fitInsideCoordinates: (coordinates) => {
        map.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            bottom: 250,
            top: 0,
            left: 0,
            right: 0,
          },
        })
      },
      centerOnUserLocation: () => {
        console.log('🎯 Centering on user location')
        if (currentUserLocation) {
          map.current?.animateToRegion({
            latitude: currentUserLocation.latitude,
            longitude: currentUserLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000)
        }
      },
      animateToUserLocation: () => {
        console.log('🎯 Animate to user location')
        if (currentUserLocation) {
          map.current?.animateToRegion({
            latitude: currentUserLocation.latitude,
            longitude: currentUserLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1500)
        }
      },
    }
  })

  const animatedStyle = useAnimatedStyle(() => {
    if (!sheetContext) {
      return {
        flex: 1,
      }
    }

    // Simplified animation - remove complex calculations
    return {
      flex: 1,
    }
  }, [])

  const handleMapError = (error: any) => {
    console.error('🚨 MapView Error:', error)
    console.error('🚨 Error details:', JSON.stringify(error, null, 2))
  }

  const onMapReadyWithErrorHandling = () => {
    try {
      console.log('🗺️ Map ready')
      console.log('📍 Map: showMyLocation setting:', showMyLocation)
      console.log('📍 Map: hasLocationPermission:', hasLocationPermission)
      onMapReady?.()
    } catch (error) {
      console.error('🚨 Map ready error:', error)
      handleMapError(error)
    }
  }

  const onRegionChangeWithErrorHandling = (region: any) => {
    try {
      onMapRegionUpdate?.(region)
    } catch (error) {
      console.error('🚨 Map region change error:', error)
      handleMapError(error)
    }
  }

  const handleMapPress = () => {
    // Collapse all expanded line cards when user taps the map
    collapseAllLines()
  }

  return (
    <Animated.View style={animatedStyle}>
      <MapView
        key={mapColorScheme} // Force re-mount when app theme changes
        ref={map}
        provider={mapProvider}
        onMapReady={onMapReadyWithErrorHandling}
        onRegionChangeComplete={onRegionChangeWithErrorHandling}
        onPress={handleMapPress}
        toolbarEnabled={false}
        showsIndoors={false}
        mapPadding={{
          top: insets.top,
          bottom: 20,
          left: 20,
          right: 20,
        }}
        initialRegion={initialRegion}
        customMapStyle={(() => {
          const mapStyle = getMapStyle(mapColorScheme)
          console.log('🗺️ Map style applied for theme:', mapColorScheme)
          return mapStyle
        })()}
        showsUserLocation={showMyLocation && hasLocationPermission}
        followsUserLocation={false}
        showsMyLocationButton={false} // Kendi butonumuzu kullanıyoruz
        userLocationAnnotationTitle="Konumunuz"
        onUserLocationChange={(event) => {
          if (event.nativeEvent.coordinate) {
            setCurrentUserLocation(event.nativeEvent.coordinate)
            console.log('📍 User location updated:', event.nativeEvent.coordinate)
          }
        }}
        showsCompass={false}
        showsScale={false}
        showsTraffic={showTraffic}
        pitchEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        style={{ flex: 1 }}
        moveOnMarkerPress={false}
      >
        {props.children}
      </MapView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  myLocationButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red', // DEBUG
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 9999,
  },
})
