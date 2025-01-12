import useSWR from "swr";
import { useLineStore } from "./useLineStore";
import type { LocationsRes } from "../types/api";

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

export default function useLocations() {
  const lineId = useLineStore((state) => state.id);
  const { data, error, isLoading } = useSWR<LocationsRes>(
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
