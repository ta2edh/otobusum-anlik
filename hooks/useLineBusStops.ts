import { getLineBusStopLocations, BusStopLocation } from '@/api/getLineBusStopLocations'
import { useQuery } from '@tanstack/react-query'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
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
  const showMyLocation = useSettings(useShallow(state => state.showMyLocation))

  const query = useQuery({
    queryKey: [`${code}-stop-locations`],
    queryFn: () => getLineBusStopLocations(code),
    staleTime: 60_000 * 30,
  })

  // Closest stop dependecy is here to cause rerender on flatlist usage
  const filteredStops = useMemo(
    () => query.data?.filter(stop => stop.yon === direction),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.data, direction, closestStop],
  )

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

      if (currentClosestStop) {
        setClosestStop(currentClosestStop)
      }
    },
    [filteredStops],
  )

  useEffect(() => {
    let locationListener: Location.LocationSubscription | undefined
    const listen = async () => {
      const loc = await Location.getCurrentPositionAsync()
      handlePositionListener(loc)

      locationListener = await Location.watchPositionAsync(
        { timeInterval: 5000 },
        handlePositionListener,
      )
    }

    if (listenToUserLocation && showMyLocation) {
      listen()
    }
    else if (!showMyLocation && closestStop) {
      console.log('set undefined')

      setClosestStop(undefined)
      locationListener?.remove()
    }

    return () => {
      locationListener?.remove()
    }
  }, [handlePositionListener, listenToUserLocation, showMyLocation, closestStop])

  return {
    query,
    closestStop,
    filteredStops,
  }
}
