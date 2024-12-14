import { Region } from 'react-native-maps'

export const regionToZoom = (region: Region) => {
  const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
  return zoom
}
