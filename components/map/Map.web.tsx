// import { GoogleMap, GoogleMapProps, useJsApiLoader } from '@react-google-maps/api'
import { APIProvider, Map, MapProps } from '@vis.gl/react-google-maps'
import { useRef } from 'react'
import { Dimensions } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { getMapStyle } from '@/constants/mapStyles'
import { useSettingsStore } from '@/stores/settings'

const dimensions = Dimensions.get('window')

// function getBoundsZoomLevel(
//   bounds: { north: number, west: number, east: number, south: number },
//   mapDim: { width: number, height: number },
// ) {
//   var WORLD_DIM = { height: 256, width: 256 }
//   var ZOOM_MAX = 21

//   function latRad(lat: number) {
//     var sin = Math.sin((lat * Math.PI) / 180)
//     var radX2 = Math.log((1 + sin) / (1 - sin)) / 2
//     return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
//   }

//   function zoom(mapPx: number, worldPx: number, fraction: number) {
//     return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2)
//   }

//   var ne = bounds.getNorthEast()
//   var sw = bounds.getSouthWest()

//   var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI

//   var lngDiff = ne.lng() - sw.lng()
//   var lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360

//   var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction)
//   var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction)

//   return Math.min(latZoom, lngZoom, ZOOM_MAX)
// }

export const TheMap = (props: MapProps) => {
  const map = useRef<google.maps.Map>()
  const { mode } = useTheme()

  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: process.env.EXPO_PUBLIC_MAP_API || '',
  // })

  const handleDragEnd = () => {
    if (!map.current) return

    const region = map.current.getBounds()?.toJSON()
    if (!region) return

    const nsDiff = region.north - region.south
    const ewDiff = region.east - region.west

    useSettingsStore.setState(() => ({
      initialMapLocation: {
        latitude: region.north - nsDiff / 2,
        longitude: region.west + ewDiff / 2,
        latitudeDelta: nsDiff,
        longitudeDelta: ewDiff,
      },
    }))
  }

  // if (!isLoaded) {
  //   return null
  // }

  const initial = useSettingsStore.getState().initialMapLocation
  const center: { lat: number, lng: number } = initial
    ? {
        lat: initial.latitude,
        lng: initial.longitude,
      }
    : {
        lat: 39.66770141070046,
        lng: 28.17840663716197,
      }

  // const zoom = getBoundsZoomLevel(
  //   initial
  //     ? {
  //         north: center.lat + initial.latitudeDelta / 2,
  //         west: center.lng - initial.longitudeDelta / 2,
  //         east: initial.longitude + initial.longitudeDelta / 2,
  //         south: initial.latitude + initial.latitudeDelta / 2,
  //       }
  //     : {
  //         north: 39.66770141070046 + 4.746350767346861 / 2,
  //         west: 28.17840663716197 - 2.978521026670929 / 2,
  //         east: 28.17840663716197 + 2.978521026670929 / 2,
  //         south: 39.66770141070046 + 4.746350767346861 / 2,
  //       },
  //   {
  //     width: dimensions.width,
  //     height: dimensions.height,
  //   },
  // )

  return (
    <APIProvider apiKey={process.env.EXPO_PUBLIC_MAP_API || ''}>
      <Map
        defaultCenter={center}
        defaultZoom={10}
        fullscreenControl={false}
        zoomControl={false}
        mapTypeControl={false}
        streetViewControl={false}

        // onLoad={(_map) => {
        //   map.current = _map
        // }}
        // onDragEnd={handleDragEnd}
        // options={{
        //   fullscreenControl: false,
        //   zoomControl: false,
        //   mapTypeControl: false,
        //   streetViewControl: false,
        //   styles: getMapStyle(mode),
        // }}
        styles={getMapStyle(mode)}
        gestureHandling="greedy"
        {...props}
      >
        {props.children}
      </Map>
    </APIProvider>

  )
}
