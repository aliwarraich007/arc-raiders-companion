import { ItemFilters } from "@/features/items/types";

export const queryKeys = {
  items: (page: number, limit: number, filters?: ItemFilters) => [
    `items`,
    { page, limit, filters },
  ],
};
