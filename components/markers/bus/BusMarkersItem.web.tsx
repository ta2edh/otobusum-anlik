import { Marker, AdvancedMarker } from '@vis.gl/react-google-maps'
import { memo } from 'react'

import { BusLocation } from '@/api/getLineBusLocations'

interface LineBusMarkersItemProps {
  location: BusLocation
  lineCode: string
}

export const LineBusMarkersItem = ({ location }: LineBusMarkersItemProps) => {
  return (
    <AdvancedMarker
      position={{
        lng: location.lng,
        lat: location.lat,
      }}
    >
    </AdvancedMarker>
  )
}

export const LineBusMarkersItemMemoized = memo(LineBusMarkersItem)
