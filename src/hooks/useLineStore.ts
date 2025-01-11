import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LineState {
  id: string;
  setId: (id: string) => void;
}

export const useLineStore = create<LineState>()(
  persist(
    (set, get) => ({
      id: "u4-heiligenstadt",
      setId: (id) => set({ id }),
    }),
    {
      name: "line-storage",
    }
  )
);
