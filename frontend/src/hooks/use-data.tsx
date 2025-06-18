import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { FindAll, UpdatePatienID } from "#/go/main/MeasurementService";
import { SortDescriptor } from "@heroui/react";
import { main } from "#/go/models";

export const keys = {
  measurement: (page: number, limit: number, sort: string, sortBy: string, serach: string) => ["measurement", page, limit, sort, sortBy, serach] as const,
};
export const useFindAllMeasurement = () => {
  const { page, limit, sort_by, sort, search } = useDataStore();

  return useQuery({
    queryKey: keys.measurement(page, limit, sort, sort_by, search),
    queryFn: () =>
      FindAll({
        page: page,
        limit: limit,
        search: search,
        sort: sort,
        sort_by: sort_by,
      }),
    // refetchInterval: 1000, // ⏱️ every 1000ms = 1 second
    // refetchIntervalInBackground: true, // optional: continue in background tab
  });
};

export const useUpdatePatienID = () => {
  return useMutation({
    mutationFn: (data: { id: number; pId: string }) => {
      console.log(data);
      return UpdatePatienID(data.id, data.pId);
    },
  });
};

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  search: string;
  page: number;
  limit: number;
  sort: "ascending" | "descending";
  sort_by: string;
};

type Actions = {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (desc: SortDescriptor) => void;
  setSearch: (search: string) => void;
};

export const useDataStore = create<State & Actions>()(
  immer((set) => ({
    search: "",
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
        state.page = 1;
        state.limit = qty;
      }),
    setSort: (desc) =>
      set((state) => {
        state.sort = desc.direction;
        state.sort_by = desc.column.toString();
      }),
    setSearch: (search) =>
      set((state) => {
        state.page = 1;
        state.search = search;
      }),
  }))
);
