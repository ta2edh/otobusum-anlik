import { getLineBusStopLocations } from '@/api/getLineBusStopLocations'
import { useQuery } from '@tanstack/react-query'

export function useLineBusStops(code: string) {
  const query = useQuery({
    queryKey: [`${code}-stop-locations`],
    queryFn: () => getLineBusStopLocations(code),
    staleTime: 60_000 * 30,
  })

  return {
    query,
  }
}
