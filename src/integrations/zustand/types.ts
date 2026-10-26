import { ArcRaidersItems } from "@/features/items/api/types";

export type TrackedItem = {
  id: string;
  name: string;
  icon: string | null;
  rarity: string | null;
  item_type: string;
  subcategory: string | null;
  loot_area: string | null;
  trackedAt: number;
};

export type State = {
  tracked: Record<string, TrackedItem>;
  setQuantity: (item: ArcRaidersItems, quantity: number) => void;
  remove: (id: string) => void;
};
