import type { LineRes } from "@/types/api";
import { useEffect } from "react";
import { create } from "zustand";

interface LineState {
  id: string | null;
  setId: (id: string | null) => void;
  data: LineRes | null;
  setData: (data: LineRes | null) => void;
}

export const useLineFetcher = () => {
  const activeLineId = useLineStore((state) => state.id);
  const setData = useLineStore((state) => state.setData);

  useEffect(() => {
    setData(null);
    if (!activeLineId) return;

    const eventSource = new EventSource(`/api/line?id=${activeLineId}`);

    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => {
      eventSource.close();
    };
  }, [activeLineId, setData]);
};

export const useLineStore = create<LineState>((set) => ({
  id: null,
  setId: (id) => set({ id }),
  data: null,
  setData: (data) => set({ data }),
}));
