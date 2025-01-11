import type { LatLngExpression } from "leaflet";
import useSWR from "swr";
import { useLineStore } from "./useLineStore";

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

type LocationRes = {
  trainCoordinates: LatLngExpression[];
  stationCoordinates: LatLngExpression[];
};
export default function useLocations() {
  const lineId = useLineStore((state) => state.id);
  const { data, error, isLoading } = useSWR<LocationRes>(
    `/api/locations?line=${lineId}`,
    fetcher,
    { refreshInterval: 10 * 1000 }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}
