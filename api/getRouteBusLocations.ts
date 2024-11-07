import { extractInnerContentXml } from "@/utils/extractInnerContentXml";
import { getBody } from "./body";

export interface Location {
  kapino: string;
  boylam: string;
  enlem: string;
  hatkodu: string;
  guzergahkodu: string;
  hatad: string;
  yon: string;
  son_konum_zamani: string;
  yakinDurakKodu: string;
}

export async function getRouteBusLocations(code: string) {
  const body = getBody("HatKodu", "GetHatOtoKonum_json", code);

  const response = await fetch("https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx", {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      SOAPAction: '"http://tempuri.org/GetHatOtoKonum_json"',
    },
    body,
  });

  const key = "GetHatOtoKonum_jsonResult";
  const content = await response.text()

  const innerContent = extractInnerContentXml(key, content);
  if (!innerContent) return;

  const responseParsed: Location[] = JSON.parse(innerContent);
  return responseParsed;
}
