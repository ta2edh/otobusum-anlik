import React from 'react'
import { useShallow } from 'zustand/react/shallow'

import { LineMarkerWrapper } from './LineMarkerWrapper'

import { useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'

interface MarkersRendererProps {
  readyToRender?: boolean
}

export const MarkersRenderer = ({ readyToRender = true }: MarkersRendererProps) => {
  // Store data
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))
  const selectedGroup = useFiltersStore(useShallow(state => state.selectedGroup))
  const lineGroups = useLinesStore(useShallow(state => state.lineGroups))
  const allLines = useLinesStore(useShallow(state => state.lines[selectedCity]))

  // Don't render if not ready
  if (!readyToRender) {
    return null
  }

  // Calculate lines to render
  const lines = selectedGroup 
    ? (lineGroups[selectedCity][selectedGroup]?.lineCodes || [])
    : allLines

  // No lines to render
  if (lines.length === 0) {
    return null
  }  return (
    <>
      {lines.map((lineCode: string) => (
        <LineMarkerWrapper key={lineCode} lineCode={lineCode} />
      ))}
    </>
  )
}

export default MarkersRenderer