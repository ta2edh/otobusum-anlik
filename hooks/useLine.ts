import { useQuery } from '@tanstack/react-query'

import { getLineBusLocations } from '@/api/getLineBusLocations'

export function useLine(lineCode: string) {
  const query = useQuery({
    queryKey: ['line', lineCode],
    queryFn: () => getLineBusLocations(lineCode),
    staleTime: 60_000 * 30,
  })

  return {
    query,
  }
}
