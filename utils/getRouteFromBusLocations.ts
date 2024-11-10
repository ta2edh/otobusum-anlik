import { BusStopLocation } from "@/api/getLineBusStopLocations";
import { useLines } from "@/stores/lines";

// TODO: This should be changed but there is not much to do because of the api. It returns the route as G or D
export const getRouteFromBusStopLocations = (
  code: string,
  route: string,
  busStops: BusStopLocation[]
) => {
  const shownBusses = useLines.getState().lines[code].filter((bus) => bus.yon === route);

  const foundStop = busStops.find((stop) =>
    shownBusses.find((bus) => bus.yakinDurakKodu === stop.durakKodu)
  );

  return foundStop?.yon;
};
