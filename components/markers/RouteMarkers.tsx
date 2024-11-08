import { useRoutes } from "@/stores/routes";
import { RouteBusMarkers } from "./RouteBusMarkers";

export function RouteMarkers() {
  const routes = useRoutes((state) => state.routes);
  const entries = Object.entries(routes);

  return (
    <>
      {entries.map(([key, value]) => (
        <RouteBusMarkers key={key} code={key} locations={value} />
      ))}
    </>
  );
}
