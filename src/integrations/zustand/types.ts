import { ArcRaidersItems } from "@/features/home/types";

export type TrackedItem = {
  id: string;
  name: string;
  icon: string | null;
  rarity: string | null;
  item_type: string;
  quantity: number;
  updatedAt: number;
};

export type State = {
  tracked: Record<string, TrackedItem>;
  setQuantity: (item: ArcRaidersItems, quantity: number) => void;
  remove: (id: string) => void;
};
