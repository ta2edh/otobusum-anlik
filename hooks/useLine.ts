import { getLineBusLocations } from '@/api/getLineBusLocations'
import { useQuery } from '@tanstack/react-query'

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
