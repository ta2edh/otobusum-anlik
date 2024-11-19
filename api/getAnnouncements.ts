import { extractInnerContentXml } from '@/utils/extractInnerContentXml'

interface Announcement {
  HAT: string
  HATKODU: string
  TIP: string
  GUNCELLEME_SAATI: string
  MESAJ: string
}

export async function getAnnouncements() {
  const response = await fetch('https://api.ibb.gov.tr/iett/UlasimDinamikVeri/Duyurular.asmx?wsdl', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=UTF-8',
      'SOAPAction': '"http://tempuri.org/GetDuyurular_json"',
    },
    body: `
      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
        </soap:Body>
      </soap:Envelope>
    `,
  })

  const key = 'GetDuyurular_jsonResult'
  const content = await response.text()

  const innerContent = extractInnerContentXml(key, content)
  if (!innerContent) return []

  const responseParsed: Announcement[] = JSON.parse(innerContent)
  return responseParsed
}
