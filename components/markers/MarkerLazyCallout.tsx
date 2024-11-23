import { useCallback, useRef, useState } from 'react'
import { Callout, MapCalloutProps, MapMarker, MapMarkerProps, Marker } from 'react-native-maps'

interface Props extends MapMarkerProps {
  calloutProps?: MapCalloutProps
}

export function MarkerLazyCallout({ calloutProps, ...props }: Props) {
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
        <Callout {...calloutProps}>
          {calloutProps?.children}
        </Callout>
      )}
    </Marker>
  )
}
