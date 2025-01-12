import useSWR from "swr";
import { useLineStore } from "./useLineStore";
import type { Station, Train } from "../types/api";

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

type LocationRes = {
  stations: Station[];
  trains: Train[];
};
export default function useLocations() {
  const lineId = useLineStore((state) => state.id);
  const { data, error, isLoading } = useSWR<LocationRes>(
    `/api/locations?line=${lineId}`,
    fetcher,
    { refreshInterval: 10 * 1000, keepPreviousData: false }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}
