import { getAllRoutes, LineRoute } from "@/api/getAllRoutes";
import { Direction } from "@/types/departure";
import { useQuery } from "@tanstack/react-query";

export function useRouteFilter(code: string) {
  const routes = useQuery({
    queryKey: ["line-routes", code],
    queryFn: () => getAllRoutes(code),
    staleTime: 60_000 * 30,
  });

  const getDefaultRoute = () => {
    return routes.data?.result.records.find(
      (item) => item.route_code === `${item.route_short_name}_G_D0`
    );
  };

  const findRouteFromCode = (code: string) => {
    return routes.data?.result.records.find((item) => item.route_code === code);
  };

  const getRouteDirection = (routeCode: string) => {
    return routeCode.split("_").at(1) as Direction | undefined;
  };

  const findOtherRouteDirection = (routeCode: string) => {
    const [left, dir, right] = routeCode.split("_");
    if (!right || !dir) return;

    const dCode = parseInt(right.substring(1));

    const direction = dir as Direction;
    const otherDirection = direction === "D" ? "G" : "D";

    const oneLess = `${left}_${otherDirection}_D${dCode - 1}`;
    const equal = `${left}_${otherDirection}_D${dCode}`;
    const oneMore = `${left}_${otherDirection}_D${dCode + 1}`;

    return routes.data?.result.records.find(
      (route) => route.route_code === oneLess || route.route_code === oneMore || route.route_code === equal
    );
  };

  return {
    routes,
    getDefaultRoute,
    findOtherRouteDirection,
    getRouteDirection,
    findRouteFromCode,
  };
}
