import { useQuery } from '@tanstack/react-query'

import { getAnnouncements } from '@/api/getAnnouncements'
import { i18n } from '@/translations/i18n'

export function useAnnouncements() {
  const query = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
    staleTime: 60_000 * 30,
    meta: {
      errorMessage: i18n.t('errorGettingAnnouncements'),
    },
  })

  return {
    query,
  }
}
