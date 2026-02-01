import Route from "@/lib/route";
import type { RouteRes } from "@/types/api";
import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RouteState {
  active: Route | null;
  setActive: (route: Route | null) => void;
  data: RouteRes | null;
  setData: (data: RouteRes | null) => void;
  favorites: string[];
  addFavorite: (route: string) => void;
  removeFavorite: (route: string) => void;
}

export const useRouteFetcher = () => {
  const activeRoute = useRouteStore((state) => state.active);
  const setData = useRouteStore((state) => state.setData);

  useEffect(() => {
    setData(null);
    if (!activeRoute) return;

    const eventSource = new EventSource(
      `/api/route?line_id=${activeRoute.getLineId()}&direction=${activeRoute.getDirectionStr()}`,
    );

    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => {
      eventSource.close();
    };
  }, [activeRoute, setData]);
};

export const useRouteStore = create<RouteState>()(
  persist(
    (set) => ({
      active: null,
      setActive: (active) => set({ active }),
      data: null,
      setData: (data) => set({ data }),
      favorites: [],
      addFavorite: (route) =>
        set((state) => ({ favorites: [...state.favorites, route] })),
      removeFavorite: (route) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (r) => r.toString() !== route.toString(),
          ),
        })),
    }),
    {
      name: "route-storage",
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
