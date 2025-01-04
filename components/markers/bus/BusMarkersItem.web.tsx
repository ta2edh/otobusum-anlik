import { Marker } from '@react-google-maps/api'
import { memo } from 'react'

import { BusLocation } from '@/api/getLineBusLocations'

interface LineBusMarkersItemProps {
  location: BusLocation
  lineCode: string
}

export const LineBusMarkersItem = ({ location }: LineBusMarkersItemProps) => {
  return (
    <Marker
      position={{
        lat: location.lat,
        lng: location.lng,
      }}
    >
      <p>deneme</p>
    </Marker>
  )
}

export const LineBusMarkersItemMemoized = memo(LineBusMarkersItem)
