import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FindAll } from "#/go/main/MeasurementService";
import { SortDescriptor } from "@heroui/react";
import { main } from "#/go/models";

export const keys = {
  measurement: (page: number, limit: number, sort: string, sortBy: string) => ["measurement", page, limit, sort, sortBy] as const,
};
export const useFindAllMeasurement = () => {
  const { page, limit, sort_by, sort } = useDataStore();

  return useQuery({
    queryKey: keys.measurement(page, limit, sort, sort_by),
    queryFn: () =>
      FindAll({
        page: page,
        limit: limit,
        search: "",
        sort: sort,
        sort_by: sort_by,
      }),
    // refetchInterval: 1000, // ⏱️ every 1000ms = 1 second
    // refetchIntervalInBackground: true, // optional: continue in background tab
  });
};

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  page: number;
  limit: number;
  sort: "ascending" | "descending";
  sort_by: string;
};

type Actions = {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (desc: SortDescriptor) => void;
};

export const useDataStore = create<State & Actions>()(
  immer((set) => ({
    page: 0,
    limit: 0,
    sort: "descending",
    sort_by: "id",
    setPage: (qty: number) =>
      set((state) => {
        state.page = qty;
      }),
    setLimit: (qty: number) =>
      set((state) => {
        state.limit -= qty;
      }),
    setSort: (desc) =>
      set((state) => {
        console.log(desc);
        state.sort = desc.direction;
        state.sort_by = desc.column.toString();
      }),
  }))
);
