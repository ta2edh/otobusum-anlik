import {
  AdvancedMarker,
  AdvancedMarkerProps,
  InfoWindowProps,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps'
import React, { useCallback, useState } from 'react'

interface MarkerWithCalloutProps {
  markerProps: AdvancedMarkerProps
  calloutProps?: InfoWindowProps & { children: React.ReactNode }
  children: React.ReactNode
}

export const MarkerWithCallout = ({
  markerProps,
  calloutProps,
  children,
}: MarkerWithCalloutProps) => {
  const [markerRef] = useAdvancedMarkerRef()

  const [infoWindowShown, setInfoWindowShown] = useState(false)

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(() => setInfoWindowShown(isShown => !isShown), [])

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={handleMarkerClick}
        {...markerProps}
      >
        {infoWindowShown
          ? calloutProps?.children
          : children}
      </AdvancedMarker>
    </>
  )
}
