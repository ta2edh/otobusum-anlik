import { useRoutes } from "@/stores/routes";
import { RouteBusMarkers } from "./RouteBusMarkers";
import { useShallow } from "zustand/react/shallow";

export function RouteMarkers() {
  const keys = useRoutes(useShallow(state => Object.keys(state.routes)))

  return (
    <>
      {keys.map((key) => (
        <RouteBusMarkers key={key} code={key} />
      ))}
    </>
  );
}
