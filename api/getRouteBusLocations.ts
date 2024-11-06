import { extractInnerContentXml } from "@/utils/extractInnerContentXml"

const getBody = (code: string) => `
<soap:Envelope
	xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<GetHatOtoKonum_json
			xmlns="http://tempuri.org/">
			<HatKodu>${code}</HatKodu>
		</GetHatOtoKonum_json>
	</soap:Body>
</soap:Envelope>
`

export interface Location {
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

export async function getRouteBusLocations(code: string) {
  const body = getBody(code)

  const response = await fetch("https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx", {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      "SOAPAction": '"http://tempuri.org/GetHatOtoKonum_json"',
    },
    body
  })

  const key = "GetHatOtoKonum_jsonResult"

  const innerContent = extractInnerContentXml(key, await response.text())
  if (!innerContent) return

  const responseParsed: Location[] = JSON.parse(innerContent)
  return responseParsed
}
