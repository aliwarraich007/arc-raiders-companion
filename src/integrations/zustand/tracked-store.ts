// features/items/store/trackedStore.ts
import { ArcRaidersItems } from "@/features/items/api/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TrackedItem } from "./types";

type State = {
  tracked: Record<string, TrackedItem>;
  toggle: (item: ArcRaidersItems) => void;
  remove: (id: string) => void;
};

export const useTrackedStore = create<State>()(
  persist(
    (set) => ({
      tracked: {},
      toggle: (item) =>
        set((s) => {
          if (s.tracked[item.id]) {
            const { [item.id]: _, ...rest } = s.tracked;
            return { tracked: rest };
          }
          return {
            tracked: {
              ...s.tracked,
              [item.id]: {
                id: item.id,
                name: item.name,
                icon: item.icon,
                rarity: item.rarity,
                item_type: item.item_type,
                subcategory: item.subcategory,
                loot_area: item.loot_area,
                trackedAt: Date.now(),
              },
            },
          };
        }),
      remove: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.tracked;
          return { tracked: rest };
        }),
    }),
    {
      name: "tracked-items-v1",
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ tracked: s.tracked }),
      // v1 entries had `quantity` and no loot_area
      migrate: (persisted: any, version) => {
        if (version < 2 && persisted?.tracked) {
          for (const id of Object.keys(persisted.tracked)) {
            const { quantity, updatedAt, ...rest } = persisted.tracked[id];
            persisted.tracked[id] = {
              subcategory: null,
              loot_area: null,
              ...rest,
              trackedAt: updatedAt ?? Date.now(),
            };
          }
        }
        return persisted as State;
      },
    },
  ),
);
