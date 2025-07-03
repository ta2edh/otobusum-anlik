import React, { useCallback, useRef, useState } from 'react'
import { Callout, MapCalloutProps, MapMarker, MapMarkerProps, Marker, MarkerPressEvent } from 'react-native-maps'

interface MarkersCalloutProps {
  markerProps: MapMarkerProps
  calloutProps?: MapCalloutProps
  children: React.ReactNode
}

export const MarkersCallout = ({ markerProps, calloutProps, children }: MarkersCalloutProps) => {
  const markerRef = useRef<MapMarker>(null)
  const [renderCallout, setRenderCallout] = useState(false)
  const hideTimeoutRef = useRef<number | null>(null)

  const handlePress = useCallback((event: MarkerPressEvent) => {
    console.log('🔍 Marker pressed, showing callout')
    
    // Eğer gizleme timeout'u varsa iptal et
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    
    markerProps?.onPress?.(event)

    setRenderCallout(true)
    setTimeout(() => {
      markerRef.current?.showCallout()
    }, 100) // Daha uzun delay ile stabil callout
  }, [markerProps])

  const handleCalloutPress = useCallback((e: any) => {
    e.stopPropagation()
    // Callout'a tıklandığında gizleme
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    
    // 3 saniye sonra gizle
    hideTimeoutRef.current = setTimeout(() => {
      setRenderCallout(false)
    }, 3000)
  }, [])

  return (
    <Marker
      ref={markerRef}
      onPress={handlePress}
      tracksViewChanges={false}
      tracksInfoWindowChanges={false} // Callout değişimlerini track etmesin
      {...markerProps}
    >
      {children}

      {renderCallout && (
        <Callout 
          tooltip 
          onPress={handleCalloutPress}
          {...calloutProps}
        >
          {calloutProps?.children}
        </Callout>
      )}
    </Marker>
  )
}
