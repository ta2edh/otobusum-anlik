import { useCallback, useRef, useState } from 'react'
import { Callout, MapCalloutProps, MapMarker, MapMarkerProps, Marker } from 'react-native-maps'

export interface MarkerLazyCalloutProps extends MapMarkerProps {
  calloutProps?: MapCalloutProps
}

export const MarkerLazyCallout = ({ calloutProps, ...props }: MarkerLazyCalloutProps) => {
  const markerRef = useRef<MapMarker>(null)
  const [renderCallout, setRenderCallout] = useState(false)

  const handlePress = useCallback(() => {
    setRenderCallout(true)
    setTimeout(() => {
      markerRef.current?.showCallout()
    })
  }, [])

  return (
    <Marker
      ref={markerRef}
      onPress={handlePress}
      {...props}
    >
      {props.children}

      {renderCallout && (
        <Callout tooltip {...calloutProps}>
          {calloutProps?.children}
        </Callout>
      )}
    </Marker>
  )
}
