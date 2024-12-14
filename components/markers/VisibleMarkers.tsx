import React from 'react'
import { LatLng } from 'react-native-maps'

import { useSettingsStore } from '@/stores/settings'
import { regionToZoom } from '@/utils/regionToZoom'

interface VisibleMarkersProps<T> {
  data: T[]
  renderItem: (item: T) => React.ReactNode
  zoomLimit: number
}

export const VisibleMarkers = <T extends { coordinates: LatLng },>(props: VisibleMarkersProps<T>) => {
  const initialRegion = useSettingsStore(state => state.initialMapLocation)
  const currentZoom = initialRegion ? regionToZoom(initialRegion) : 0

  if (!initialRegion || currentZoom < props.zoomLimit) return

  const startXOffset = initialRegion.longitudeDelta / 2
  const startYOffset = initialRegion.latitudeDelta / 2

  const x = initialRegion.longitude - startXOffset
  const maxX = initialRegion.longitude + startXOffset

  const y = initialRegion.latitude - startYOffset
  const maxY = initialRegion.latitude + startYOffset

  const filteredItems = props.data.filter(item => (
    item.coordinates.longitude > x
    && item.coordinates.longitude < maxX
    && item.coordinates.latitude > y
    && item.coordinates.latitude < maxY
  ))

  return (
    <>
      {filteredItems.map(item => props.renderItem(item))}
    </>
  )
}
