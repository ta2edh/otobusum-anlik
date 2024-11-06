import { DayType, Direction } from "@/types/departure";
import { extractInnerContentXml } from "@/utils/extractInnerContentXml";

const getBody = (code: string) => `
<soap:Envelope
	xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<GetPlanlananSeferSaati_json
			xmlns="http://tempuri.org/">
			<HatKodu>${code}</HatKodu>
		</GetPlanlananSeferSaati_json>
	</soap:Body>
</soap:Envelope>
`;

export interface PlannedDeparture {
  SHATKODU: string;
  HATADI: string;
  SGUZERAH: string;
  SYON: Direction;
  SGUNTIPI: DayType;
  GUZERGAH_ISARETI: string;
  SSERVISTIPI: string;
  DT: `${number}:${number}`;
}

export async function getPlannedDepartures(code: string) {
  const body = getBody(code);

  const response = await fetch(
    "https://api.ibb.gov.tr/iett/UlasimAnaVeri/PlanlananSeferSaati.asmx",
    {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: '"http://tempuri.org/GetPlanlananSeferSaati_json"',
      },
      body,
    }
  );

  const key = "GetPlanlananSeferSaati_jsonResult";

  const innerContent = extractInnerContentXml(key, await response.text());
  if (!innerContent) return [];

  const responseParsed: PlannedDeparture[] = JSON.parse(innerContent);
  return responseParsed;
}
