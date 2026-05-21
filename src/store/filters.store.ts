import { create } from "zustand";
import type { GlobalFilters } from "@/types";

interface FiltersState {
  filters: GlobalFilters;
  setFilter: <K extends keyof GlobalFilters>(
    key: K,
    value: GlobalFilters[K]
  ) => void;
  setFilters: (filters: Partial<GlobalFilters>) => void;
  clearFilters: () => void;
}

const initialFilters: GlobalFilters = {
  region: undefined,
  bloodGroup: undefined,
  search: undefined, 
  grade: undefined,
  
};

export const useFiltersStore = create<FiltersState>((set) => ({
  filters: initialFilters,

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    })),

  clearFilters: () =>
    set({
      filters: initialFilters,
    }),
}));