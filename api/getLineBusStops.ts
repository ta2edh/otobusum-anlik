import { Direction } from '@/types/departure'
import { getBody } from './body'
import { BusLineStop } from '@/types/bus'

export async function getLineBusStops(code: string) {
  const body = getBody('hat_kodu', 'DurakDetay_GYY', code)

  const response = await fetch('https://api.ibb.gov.tr/iett/ibb/ibb.asmx?wsdl', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=UTF-8',
      'SOAPAction': '"http://tempuri.org/DurakDetay_GYY"',
    },
    body,
  })

  const text = await response.text()
  const datasetInnerContent = text
    .split(`<NewDataSet xmlns="">`)
    .at(-1)
    ?.split(`</NewDataSet>`)
    .at(0)

  const tableInnerContent = datasetInnerContent?.split(`<Table>`)
  if (!tableInnerContent) return

  const results: BusLineStop[] = []
  for (let index = 1; index < tableInnerContent.length; index++) {
    const itemInnerContent = tableInnerContent[index]?.slice(0, -8)
    if (!itemInnerContent) continue

    results.push({
      // hatKodu: itemInnerContent.split(`<HATKODU>`).at(-1)?.split(`</HATKODU>`).at(0)!,
      direction: itemInnerContent.split(`<YON>`).at(-1)?.split(`</YON>`).at(0) as Direction,
      // siraNo: itemInnerContent.split(`<SIRANO>`).at(-1)?.split(`</SIRANO>`).at(0)!,
      stop_code: itemInnerContent.split(`<DURAKKODU>`).at(-1)?.split(`</DURAKKODU>`).at(0)!,
      stop_name: itemInnerContent.split(`<DURAKADI>`).at(-1)?.split(`</DURAKADI>`).at(0)!,
      x_coord: parseFloat(itemInnerContent.split(`<XKOORDINATI>`).at(-1)?.split(`</XKOORDINATI>`).at(0)!),
      y_coord: parseFloat(itemInnerContent.split(`<YKOORDINATI>`).at(-1)?.split(`</YKOORDINATI>`).at(0)!),
      stop_type: itemInnerContent.split(`<DURAKTIPI>`).at(-1)?.split(`</DURAKTIPI>`).at(0)!,
      province: itemInnerContent
        .split(`<ISLETMEBOLGE>`)
        .at(-1)
        ?.split(`</ISLETMEBOLGE>`)
        .at(0)!,
      // isletmeAltBolge: itemInnerContent
      //   .split(`<ISLETMEALTBOLGE>`)
      //   .at(-1)
      //   ?.split(`</ISLETMEALTBOLGE>`)
      //   .at(0)!,
      // : itemInnerContent.split(`<ILCEADI>`).at(-1)?.split(`</ILCEADI>`).at(0)!,
    })
  }

  return results
}
