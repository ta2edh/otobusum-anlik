import React, { useCallback, useRef, useState } from 'react'
import { Callout, MapCalloutProps, MapMarker, MapMarkerProps, Marker, MarkerPressEvent } from 'react-native-maps'

interface MarkerWithCalloutProps {
  markerProps: MapMarkerProps
  calloutProps?: MapCalloutProps
  children: React.ReactNode
}

export const MarkerWithCallout = ({ markerProps, calloutProps, children }: MarkerWithCalloutProps) => {
  const markerRef = useRef<MapMarker>(null)
  const [renderCallout, setRenderCallout] = useState(false)

  const handlePress = useCallback((event: MarkerPressEvent) => {
    markerProps?.onPress?.(event)

    setRenderCallout(true)
    setTimeout(() => {
      markerRef.current?.showCallout()
    })
  }, [markerProps])

  return (
    <Marker
      ref={markerRef}
      onPress={handlePress}
      {...markerProps}
    >
      {children}

      {renderCallout && (
        <Callout tooltip {...calloutProps}>
          {calloutProps?.children}
        </Callout>
      )}
    </Marker>
  )
}
