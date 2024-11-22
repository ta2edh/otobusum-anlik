import { getLineBusLocations } from '@/api/getLineBusLocations'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useLine(lineCode: string) {
  const query = useQuery({
    queryKey: ['line', lineCode],
    queryFn: () => getLineBusLocations(lineCode),
    staleTime: 60_000 * 30,
  })

  useEffect(() => {
    if (query.isSuccess) {
      console.log('sucess', lineCode)
    }
  }, [query.isSuccess, lineCode])

  return {
    query,
  }
}
