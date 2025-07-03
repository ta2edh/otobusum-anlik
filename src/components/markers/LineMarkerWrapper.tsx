import React from 'react'
import { useShallow } from 'zustand/react/shallow'

import { MarkersBuses } from './buses/MarkersBuses'
import { MarkersLineRouteLine } from './line/MarkersLineRouteLine'
import { MarkersStop } from './stop/MarkersStop'
import { MarkersStopClusteredMemoized } from './stop/MarkersStopClustered'

import { useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'

interface LineMarkerWrapperProps {
  lineCode: string
}

export const LineMarkerWrapper = ({ lineCode }: LineMarkerWrapperProps) => {
  // Always call hooks in the same order - before any early returns
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))
  const selectedGroup = useFiltersStore(useShallow(state => state.selectedGroup))
  const linesStore = useLinesStore()
  const invisibleLines = useMiscStore((state: any) => state.invisibleLines)
  const clusterStops = useSettingsStore(useShallow(state => state.clusterStops))

  // Check if line still exists in store
  const lineStillExists = selectedGroup
    ? linesStore.lineGroups[selectedCity][selectedGroup]?.lineCodes.includes(lineCode)
    : linesStore.lines[selectedCity].includes(lineCode)

  // Don't render if line no longer exists or is invisible
  if (!lineStillExists || invisibleLines.includes(lineCode)) {
    return null
  }

  return (
    <React.Fragment key={`line-${lineCode}`}>
      {/* Hat rotası */}
      <MarkersLineRouteLine lineCode={lineCode} />

      {/* Duraklar */}
      {clusterStops ? (
        <MarkersStopClusteredMemoized lineCode={lineCode} />
      ) : (
        <MarkersStop lineCode={lineCode} />
      )}

      {/* Otobüsler */}
      <MarkersBuses lineCode={lineCode} />
    </React.Fragment>
  )
}

export default LineMarkerWrapper
