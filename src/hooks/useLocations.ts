import type { LatLngExpression } from "leaflet";
import useSWR from "swr";

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

type LocationRes = {
  coordinates: LatLngExpression[];
};
export default function useLocations() {
  const { data, error, isLoading } = useSWR<LocationRes>(
    "/api/locations",
    fetcher,
    { refreshInterval: 10 * 1000 }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}
