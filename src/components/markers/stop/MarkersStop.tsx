import { memo, useMemo, useState, useEffect } from 'react'
import { LatLng } from 'react-native-maps'

import { useLineBusStops } from '@/hooks/queries/useLineBusStops'

import { MarkersFiltersInView } from '../filters/MarkersFiltersInView'
import { MarkersFiltersZoomMemoized } from '../filters/MarkersFiltersZoom'

import { MarkersStopItemMemoized } from './MarkersStopItem'

import { useFiltersStore, getSelectedRouteCode } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'

interface Props {
  lineCode: string
}

export const MarkersStop = ({ lineCode }: Props) => {
  const [stableStops, setStableStops] = useState<any[]>([])
  
  const routeCode = useFiltersStore(() => getSelectedRouteCode(lineCode))
  const selectedCity = useFiltersStore(state => state.selectedCity)
  const selectedGroup = useFiltersStore(state => state.selectedGroup)
  const invisibleLines = useMiscStore(state => state.invisibleLines)
  const linesStore = useLinesStore()
  
  const { query } = useLineBusStops(routeCode)
  
  // Check if line still exists
  const lineExists = useMemo(() => {
    return selectedGroup
      ? linesStore.lineGroups[selectedCity][selectedGroup]?.lineCodes.includes(lineCode)
      : linesStore.lines[selectedCity].includes(lineCode)
  }, [selectedGroup, linesStore.lineGroups, linesStore.lines, selectedCity, lineCode])
  
  // Update stable stops when new data arrives
  useEffect(() => {
    if (query.data && query.data.length > 0 && lineExists) {
      const processedStops = query.data.map(stop => ({
        ...stop,
        coordinates: {
          longitude: stop.x_coord,
          latitude: stop.y_coord,
        } as LatLng,
      }))
      setStableStops(processedStops)
      console.log(`🚏 Updated stops for ${lineCode}: ${processedStops.length} stops`)
    }
  }, [query.data, lineCode, lineExists])
  
  // Clear stops when line is removed
  useEffect(() => {
    if (!lineExists) {
      setStableStops([])
      console.log(`🚏 Cleared stops for removed line: ${lineCode}`)
    }
  }, [lineExists, lineCode])
  
  // Don't render if line is invisible
  if (invisibleLines.includes(lineCode)) {
    return null
  }
  
  // Don't render if no stops
  if (stableStops.length === 0) {
    return null
  }

  return (
    <MarkersFiltersInView
      data={stableStops}
      renderItem={item => (
        <MarkersFiltersZoomMemoized
          key={`${item.x_coord}-${item.y_coord}-${lineCode}-${item.stop_code}`}
          limit={13}
        >
          <MarkersStopItemMemoized type="point" stop={item} lineCode={lineCode} />
        </MarkersFiltersZoomMemoized>
      )}
    >
    </MarkersFiltersInView>
  )
}

// Simple memo
export const MarkersStopMemoized = memo(MarkersStop)
