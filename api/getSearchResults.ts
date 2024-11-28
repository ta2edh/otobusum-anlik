import { BusStop } from '@/models/bus'

export interface SearchResult {
  Path: string
  Code: string
  Name: string
  Stationcode: number
}

export interface SearchResponse {
  stop: BusStop
  // list: SearchResult[]
}

export async function getSearchResults(code: string) {
  // return (await fetch(`https://iett.istanbul/tr/RouteStation/GetSearchItems?key=${code}&langid=1`)).json()
}
