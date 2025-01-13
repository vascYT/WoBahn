import { useLineStore } from "./useLineStore";
import type { LocationsRes } from "../types/api";
import { useEffect, useState } from "react";

export default function useLine() {
  const lineId = useLineStore((state) => state.id);
  const [data, setData] = useState<LocationsRes | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`/api/line?id=${lineId}`);
    setData(null);

    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => {
      eventSource.close();
    };
  }, [lineId]);

  return data;
}
