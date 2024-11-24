import { getLineBusStopLocations, BusStopLocation } from '@/api/getLineBusStopLocations'
import { useQuery } from '@tanstack/react-query'

import { useCallback, useEffect, useMemo, useState } from 'react'
import * as Location from 'expo-location'

import { getDistanceFromLatLon } from '@/utils/getDistanceFromLatLon'
import { useSettings } from '@/stores/settings'
import { Direction } from '@/types/departure'

export function useLineBusStops(
  code: string,
  direction?: Direction,
  listenToUserLocation?: boolean,
) {
  const [closestStop, setClosestStop] = useState<BusStopLocation>()

  const query = useQuery({
    queryKey: [`${code}-stop-locations`],
    queryFn: () => getLineBusStopLocations(code),
    staleTime: 60_000 * 30,
    meta: { persist: true },
  })

  // Closest stop dependency is here to cause rerender on flatlist usage
  const filteredStops = useMemo(
    () => query.data?.filter(stop => stop.yon === direction),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.data, direction, closestStop],
  )

  // TODO: These location listeners should moved to their own provider like useMap()
  const handlePositionListener: Location.LocationCallback = useCallback(
    (location) => {
      let currentMinimumDistance
      let currentClosestStop

      for (let index = 0; index < (filteredStops?.length || 0); index++) {
        const stop = filteredStops?.at(index)
        if (!stop) continue

        const distance = getDistanceFromLatLon(
          { ...location.coords },
          {
            latitude: parseFloat(stop.yKoordinati),
            longitude: parseFloat(stop.xKoordinati),
          },
        )

        if (!currentMinimumDistance || currentMinimumDistance > distance) {
          currentMinimumDistance = distance
          currentClosestStop = stop
        }
      }

      if (currentClosestStop && currentClosestStop.durakKodu !== closestStop?.durakKodu) {
        setClosestStop(currentClosestStop)
      }
    },
    [filteredStops, closestStop],
  )

  const setupListener = useCallback(async () => {
    const listener = await Location.watchPositionAsync(
      { timeInterval: 5000, distanceInterval: 30 },
      handlePositionListener,
    )

    return listener
  }, [handlePositionListener])

  useEffect(() => {
    let locationListener: Location.LocationSubscription | undefined
    const unlisten = useSettings.subscribe(state => state.showMyLocation, async (showLocation) => {
      if (listenToUserLocation && showLocation && !locationListener) {
        locationListener = await setupListener()
      } else if (!showLocation && closestStop) {
        setClosestStop(undefined)
        locationListener?.remove()
      }
    }, {
      fireImmediately: true,
    })

    return () => {
      unlisten()
      locationListener?.remove()
    }
  }, [closestStop, listenToUserLocation, setupListener])

  return {
    query,
    closestStop,
    filteredStops,
  }
}
