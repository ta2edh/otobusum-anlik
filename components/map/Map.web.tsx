import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import React from 'react'

export const TheMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.EXPO_PUBLIC_MAP_API || '',
  })

  const containerStyle = {
    flex: 1,
  }

  const center = {
    lat: -3.745,
    lng: -38.523,
  }

  if (!isLoaded) {
    return null
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
    />
  )
}
