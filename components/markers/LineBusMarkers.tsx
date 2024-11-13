import { useLines } from '@/stores/lines'
import { useFilters } from '@/stores/filters'
import { useShallow } from 'zustand/react/shallow'
import { memo } from 'react'
import { useRouteFilter } from '@/hooks/useRouteFilter'
import { LineBusMarker } from './LineBusMarker'

interface Props {
  code: string
}

export const LineBusMarkers = memo(function LineBusMarkers(props: Props) {
  const line = useLines(useShallow(state => state.lines[props.code]))
  const selectedRoute = useFilters(useShallow(state => state.selectedRoutes[props.code]))
  const { getDefaultRoute } = useRouteFilter(props.code)

  const route = selectedRoute ?? getDefaultRoute()
  const filtered = line?.filter(loc => loc.guzergahkodu === route)

  return (
    <>
      {filtered?.map(loc => (
        <LineBusMarker key={loc.kapino} lineCode={props.code} location={loc} />
      ))}
    </>
  )
})
