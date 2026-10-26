import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { State } from "./types";

export const useTrackedStore = create<State>()(
  persist(
    (set) => ({
      tracked: {},
      setQuantity: (item, quantity) =>
        set((s) => {
          if (quantity <= 0) {
            const { [item.id]: _, ...rest } = s.tracked;
            return {
              tracked: rest,
            };
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
                quantity,
                updatedAt: Date.now(),
              },
            },
          };
        }),
      remove: (id) => {
        set((s) => {
          const { [id]: _, ...rest } = s.tracked;
          return { tracked: rest };
        });
      },
    }),
    {
      name: "item-tracking-v1",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
