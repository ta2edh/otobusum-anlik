import { LatLng } from 'react-native-maps'

export const radiansFromToLatLng = (from: LatLng, to: LatLng): [number, number] => {
  const longitudeDistance = to.longitude - from.longitude

  const y = Math.sin(longitudeDistance) * Math.cos(to.latitude)
  const x = Math.cos(from.latitude) * Math.sin(to.latitude) - Math.sin(from.latitude) * Math.cos(to.latitude) * Math.cos(longitudeDistance)

  return [x, y]
}
