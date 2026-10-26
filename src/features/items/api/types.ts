export type ArcRaidersItems = {
  id: string;
  name: string;
  description: string | null;
  item_type: string;
  loadout_slots: string[];
  icon: string | null;
  rarity: string | null;
  value: number | null;
  workbench: unknown | null;
  stat_block: Record<string, unknown>;
  flavor_text: string | null;
  subcategory: string | null;
  created_at: string;
  updated_at: string;
  shield_type: string | null;
  loot_area: string | null;
  sources: unknown | null;
  ammo_type: string | null;
  locations: unknown[];
  guide_links: unknown[];
  article: unknown | null;
  guide_url: string | null;
  cosmetic: {
    kind: string;
    slot: string;
    settings: {
      name: string;
      options: {
        name: string;
      }[];
    }[];
  } | null;
};

export type ArcRaidersItemsResponse = {
  data: ArcRaidersItems[];
  maxValue: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
