import React from 'react'

import { useLine } from '@/hooks/queries/useLine'
import { MarkersBusesItemMemoized } from './MarkersBusesItem'
import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { useMiscStore } from '@/stores/misc'
import { useLinesStore } from '@/stores/lines'

interface Props {
  lineCode: string
}

export const MarkersBuses = ({ lineCode }: Props) => {
  const invisibleLines = useMiscStore((state: any) => state.invisibleLines)
  const routeCode = useFiltersStore(() => getSelectedRouteCode(lineCode))
  const selectedCity = useFiltersStore((state) => state.selectedCity)
  const selectedGroup = useFiltersStore((state) => state.selectedGroup)
  const linesStore = useLinesStore()
  
  // Check if line still exists in store
  const lineStillExists = selectedGroup
    ? linesStore.lineGroups[selectedCity][selectedGroup]?.lineCodes.includes(lineCode)
    : linesStore.lines[selectedCity].includes(lineCode)
  
  // ALWAYS call useLine hook - but disable it if line doesn't exist
  const { query } = useLine(lineCode, lineStillExists && !invisibleLines.includes(lineCode))
  
  // Don't render if line no longer exists or is invisible
  if (!lineStillExists || invisibleLines.includes(lineCode)) {
    return null
  }

  // Loading, error, or no data
  if (query.isLoading || query.isError || !query.data) {
    return null
  }
  // Filter buses by current route
  const buses = query.data.filter((bus: any) => bus.route_code === routeCode)

  // Debug duplicate keys
  if (buses.length > 0) {
    const busIds = buses.map((bus: any) => bus.bus_id)
    const duplicateIds = busIds.filter((id, index) => busIds.indexOf(id) !== index)
    if (duplicateIds.length > 0) {
      console.warn(`🚨 Duplicate bus IDs found in ${lineCode}:`, duplicateIds)
    }
  }

  // No buses for this route
  if (buses.length === 0) {
    return null
  }
  return (
    <>
      {buses.map((bus: any, index: number) => (
        <MarkersBusesItemMemoized
          key={`bus-${lineCode}-${bus.bus_id || 'unknown'}-${bus.route_code}-${index}-${bus.lat}-${bus.lng}`}
          location={bus}
          lineCode={lineCode}
        />
      ))}
    </>
  )
}

export default MarkersBuses
