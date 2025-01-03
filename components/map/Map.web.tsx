import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { useRef } from 'react'
import { Dimensions } from 'react-native'

import { useSettingsStore } from '@/stores/settings'

const dimensions = Dimensions.get('window')

function getBoundsZoomLevel(bounds: google.maps.LatLngBounds, mapDim: { width: number, height: number }) {
  var WORLD_DIM = { height: 256, width: 256 }
  var ZOOM_MAX = 21

  function latRad(lat: number) {
    var sin = Math.sin(lat * Math.PI / 180)
    var radX2 = Math.log((1 + sin) / (1 - sin)) / 2
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
  }

  function zoom(mapPx: number, worldPx: number, fraction: number) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2)
  }

  var ne = bounds.getNorthEast()
  var sw = bounds.getSouthWest()

  var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI

  var lngDiff = ne.lng() - sw.lng()
  var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360

  var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction)
  var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction)

  return Math.min(latZoom, lngZoom, ZOOM_MAX)
}

export const TheMap = () => {
  const map = useRef<google.maps.Map>()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.EXPO_PUBLIC_MAP_API || '',
  })

  const handleDragEnd = () => {
    if (!map.current) return
    const region = map.current.getBounds()?.toJSON()
    if (!region) return

    console.log(region)

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

  const handleOnLoad = (_map: google.maps.Map) => {
    map.current = _map
  }

  if (!isLoaded) {
    return null
  }

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

  const zoom = getBoundsZoomLevel(new google.maps.LatLngBounds({
    north: center.lat + initial!.latitudeDelta / 2,
    west: center.lng - initial!.longitudeDelta / 2,
    east: initial ? initial.longitude + initial.longitudeDelta / 2 : 28.17840663716197 + 2.978521026670929,
    south: initial ? initial.latitude + initial.latitudeDelta / 2 : 39.66770141070046 + 4.746350767346861,
  }),
  {
    width: dimensions.width,
    height: dimensions.height,
  },
  )

  return (
    <GoogleMap
      mapContainerStyle={{ flex: 1 }}
      center={center}
      zoom={zoom}
      onLoad={handleOnLoad}
      onDragEnd={handleDragEnd}
      options={{
        fullscreenControl: false,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
      }}
    />
  )
}
