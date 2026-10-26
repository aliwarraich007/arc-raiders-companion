import { queryKeys } from "@/@core/constants/query-keys";
import { nativeFetch } from "@/@core/helpers/fetch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArcRaidersItemsResponse } from "./types";
import { ItemFilters } from "../items/types";

const DAY = 24 * 60 * 60 * 1000;

export const useFetchItems = (
  page: number,
  limit: number,
  filters: ItemFilters = {},
) =>
  useQuery({
    queryKey: queryKeys.items(page, limit, filters),
    queryFn: ({ signal }) => {
      const params: Record<string, string | number> = { page, limit };
      if (filters.search) params.search = filters.search;
      if (filters.rarity) params.rarity = filters.rarity;
      if (filters.item_type) params.item_type = filters.item_type;
      if (filters.loadout_slot) params.loadout_slot = filters.loadout_slot;

      return nativeFetch<ArcRaidersItemsResponse>("/items", { params, signal });
    },
    staleTime: DAY,
    gcTime: 7 * DAY,
    placeholderData: keepPreviousData,
    meta: { persist: !filters.search },
  });
