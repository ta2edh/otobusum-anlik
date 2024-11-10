import { BusStopLocation } from "@/api/getLineBusStopLocations";
import { useLines } from "@/stores/lines";

// TODO: This should be changed but there is not much to do because of the api. It returns the direction as G or D
export const getDirectionFromBusStopLocations = (
  code: string,
  direction: string,
  busStops: BusStopLocation[]
) => {
  const shownBusses = useLines.getState().lines[code].filter((bus) => bus.yon === direction);

  const foundStop = busStops.find((stop) =>
    shownBusses.find((bus) => bus.yakinDurakKodu === stop.durakKodu)
  );

  return foundStop?.yon;
};
