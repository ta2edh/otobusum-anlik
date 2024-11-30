import { getBody } from './body'

import { extractInnerContentXml } from '@/utils/extractInnerContentXml'

export interface BusLocation {
  kapino: string
  boylam: string
  enlem: string
  hatkodu: string
  guzergahkodu: string
  hatad: string
  yon: string
  son_konum_zamani: string
  yakinDurakKodu: string
}

export async function getLineBusLocations(code: string) {
  const body = getBody('HatKodu', 'GetHatOtoKonum_json', code)

  const response = await fetch('https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=UTF-8',
      'SOAPAction': '"http://tempuri.org/GetHatOtoKonum_json"',
    },
    body,
  })

  const key = 'GetHatOtoKonum_jsonResult'
  const content = await response.text()

  const innerContent = extractInnerContentXml(key, content)
  if (!innerContent) return []

  const responseParsed: BusLocation[] = JSON.parse(innerContent)
  return responseParsed
}
