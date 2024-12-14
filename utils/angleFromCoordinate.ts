export const angleFromCoordinate = (lat1: number, long1: number, lat2: number, long2: number) => {
  const dLon = long2 - long1

  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)

  let brng = Math.atan2(y, x)

  brng = brng * (180 / Math.PI)
  brng = (brng + 360) % 360
  brng = 360 - brng // count degrees counter-clockwise - remove to make clockwise

  return brng
}
