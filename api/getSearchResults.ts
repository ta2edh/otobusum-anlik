import { BusLine, BusStop } from '@/types/bus'
import { api } from './api'

export interface SearchResponse {
  stops: BusStop[]
  lines: BusLine[]
}

export async function getSearchResults(query: string): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
  })

  return await api(`/search?${params.toString()}`)
}
