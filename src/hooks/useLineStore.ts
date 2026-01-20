import Route from "@/lib/route";
import type { LineRes } from "@/types/api";
import { useEffect } from "react";
import { create } from "zustand";

interface LineState {
  activeRoute: Route | null;
  setActiveRoute: (route: Route | null) => void;
  data: LineRes | null;
  setData: (data: LineRes | null) => void;
}

export const useLineFetcher = () => {
  const activeRoute = useLineStore((state) => state.activeRoute);
  const setData = useLineStore((state) => state.setData);

  useEffect(() => {
    setData(null);
    if (!activeRoute) return;

    const eventSource = new EventSource(
      `/api/line?line_id=${activeRoute.getLineId()}&direction=${activeRoute.getDirectionStr()}`,
    );

    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => {
      eventSource.close();
    };
  }, [activeRoute, setData]);
};

export const useLineStore = create<LineState>((set) => ({
  activeRoute: null,
  setActiveRoute: (activeRoute) => set({ activeRoute }),
  data: null,
  setData: (data) => set({ data }),
}));
