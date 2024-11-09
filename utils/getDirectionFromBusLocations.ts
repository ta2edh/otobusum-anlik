import { BusStopLocation } from "@/api/getRouteBusStopLocations";
import { useRoutes } from "@/stores/routes";

// TODO: This should be changed but there is not much to do because of the api. It returns the direction as G or D
export const getDirectionFromBusStopLocations = (
  code: string,
  direction: string,
  busStops: BusStopLocation[]
) => {
  const shownBusses = useRoutes.getState().routes[code].filter((bus) => bus.yon === direction);

  const foundStop = busStops.find((stop) =>
    shownBusses.find((bus) => bus.yakinDurakKodu === stop.durakKodu)
  );

  return foundStop?.yon;
};
