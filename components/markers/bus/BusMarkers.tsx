import { memo } from 'react'

import { useLine } from '@/hooks/queries/useLine'

import { LineBusMarkersItemMemoized } from './BusMarkersItem'

import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'

interface Props {
  code: string
}

export const LineBusMarkers = (props: Props) => {
  const { query } = useLine(props.code)
  const routeCode = useFiltersStore(() => getSelectedRouteCode(props.code))

  const filtered = query.data?.filter(loc => loc.guzergahkodu === routeCode) || []

  return (
    <>
      {filtered?.map(loc => (
        <LineBusMarkersItemMemoized
          key={loc.kapino}
          location={loc}
          lineCode={props.code}
        />
      ))}
    </>
  )
}

export const LineBusMarkersMemoized = memo(LineBusMarkers)
