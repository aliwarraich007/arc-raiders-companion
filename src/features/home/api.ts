import { queryKeys } from "@/@core/constants/query-keys";
import { nativeFetch } from "@/@core/helpers/fetch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArcRaidersItemsResponse } from "./types";

const DAY = 24 * 60 * 60 * 1000;

export const useFetchItems = (page: number, limit: number) =>
  useQuery({
    queryKey: queryKeys.items(page, limit),
    queryFn: ({ signal }) =>
      nativeFetch<ArcRaidersItemsResponse>("/items", {
        params: { page, limit },
        signal,
      }),
    staleTime: DAY,
    gcTime: 7 * DAY,
    placeholderData: keepPreviousData,
    meta: { persist: true },
  });
