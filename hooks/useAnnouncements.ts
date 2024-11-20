import { getAnnouncements } from '@/api/getAnnouncements'
import { useQuery } from '@tanstack/react-query'

export function useAnnouncements() {
  const query = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
    staleTime: 60_000 * 30,
  })

  return {
    query,
  }
}
